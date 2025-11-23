import httpx
from typing import Dict, Any, Optional

class WeatherAgent:
    BASE_URL = "https://api.open-meteo.com/v1/forecast"

    @staticmethod
    async def get_weather(lat: float, lon: float) -> Optional[Dict[str, Any]]:
        """
        Fetch current weather and forecast for a given latitude and longitude.
        """
        params = {
            "latitude": lat,
            "longitude": lon,
            "current": "temperature_2m,precipitation,weather_code",
            "daily": "temperature_2m_max,temperature_2m_min,precipitation_probability_max",
            "timezone": "auto"
        }
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(WeatherAgent.BASE_URL, params=params)
                response.raise_for_status()
                return response.json()
            except Exception as e:
                print(f"Error fetching weather: {e}")
                return None

    @staticmethod
    def format_weather_response(data: Dict[str, Any], place_name: str) -> str:
        if not data:
            return f"I couldn't fetch the weather for {place_name}."
            
        current = data.get("current", {})
        temp = current.get("temperature_2m", "N/A")
        precip = current.get("precipitation", 0)
        
        daily = data.get("daily", {})
        rain_chance = daily.get("precipitation_probability_max", [0])[0] if "precipitation_probability_max" in daily else 0
        
        return f"In {place_name} it's currently {temp}°C with a chance of {rain_chance}% to rain."
