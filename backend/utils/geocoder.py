import httpx
from typing import Optional, Tuple

class Geocoder:
    BASE_URL = "https://nominatim.openstreetmap.org/search"

    @staticmethod
    async def get_coordinates(place_name: str) -> Optional[Tuple[float, float]]:
        """
        Fetch latitude and longitude for a given place name using Nominatim API.
        """
        params = {
            "q": place_name,
            "format": "json",
            "limit": 1
        }
        headers = {
            "User-Agent": "InkleTourismAgent/1.0"
        }
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(Geocoder.BASE_URL, params=params, headers=headers)
                response.raise_for_status()
                data = response.json()
                
                if data:
                    return float(data[0]["lat"]), float(data[0]["lon"])
                return None
            except Exception as e:
                print(f"Error fetching coordinates: {e}")
                return None
