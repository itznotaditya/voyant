import re
from typing import Dict, Any, List, Optional
from agents.weather_agent import WeatherAgent
from agents.places_agent import PlacesAgent
from utils.geocoder import Geocoder

class Orchestrator:
    def __init__(self):
        self.weather_agent = WeatherAgent()
        self.places_agent = PlacesAgent()
        self.geocoder = Geocoder()

    async def process_query(self, user_input: str, preferences: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Analyze user input, determine intent, call agents, and construct a response.
        
        Args:
            user_input: The user's query
            preferences: Optional preferences dict with category_filter, etc.
        """
        if preferences is None:
            preferences = {}
        
        category_filter = preferences.get("category_filter", "all")
        intent = self._determine_intent(user_input)
        location = self._extract_location(user_input)

        if not location:
            return {
                "text": "I'm sorry, I couldn't identify the location you're asking about. Please specify a city or place.",
                "data": {}
            }

        coords = await self.geocoder.get_coordinates(location)
        if not coords:
            return {
                "text": f"I'm sorry, I don't know where '{location}' is. Please check the spelling or try a major city.",
                "data": {}
            }

        lat, lon = coords
        response_parts = []
        data = {"location": location, "lat": lat, "lon": lon}

        # Execute agents based on intent
        if intent in ["weather", "both"]:
            weather_data = await self.weather_agent.get_weather(lat, lon)
            if weather_data:
                data["weather"] = weather_data
                response_parts.append(self.weather_agent.format_weather_response(weather_data, location))

        if intent in ["places", "both"]:
            places_data = await self.places_agent.get_places(lat, lon, location, category_filter=category_filter)
            if places_data:
                data["places"] = places_data
                response_parts.append(self.places_agent.format_places_response(places_data, location, category_filter))
        
        # If no specific intent detected but location found, default to "places" only
        # Based on Example 1: "I'm going to go to Bangalore, let's plan my trip" → shows only places
        if intent == "unknown":
            # Default to places only for vague queries
            places_data = await self.places_agent.get_places(lat, lon, location, category_filter=category_filter)
            
            if places_data:
                data["places"] = places_data
                response_parts.append(self.places_agent.format_places_response(places_data, location, category_filter))

        final_text = " ".join(response_parts)
        return {
            "text": final_text,
            "data": data
        }

    def _determine_intent(self, text: str) -> str:
        text = text.lower()
        has_weather = any(w in text for w in ["weather", "temperature", "rain", "forecast", "hot", "cold"])
        has_places = any(w in text for w in ["places", "visit", "sightseeing", "tourist", "attractions", "plan my trip", "go to"])
        
        if has_weather and has_places:
            return "both"
        elif has_weather:
            return "weather"
        elif has_places:
            return "places"
        return "unknown"

    def _extract_location(self, text: str) -> Optional[str]:
        """
        Extract location from text using regex patterns and heuristics.
        """
        text_clean = text.lower().strip()
        
        # Remove weather-related keywords that might interfere with location extraction
        # e.g., "Bangalore temperature" -> "Bangalore"
        weather_keywords = ["weather", "temperature", "temp", "forecast", "rain", "hot", "cold", "climate"]
        for keyword in weather_keywords:
            text_clean = re.sub(r'\b' + keyword + r'\b', '', text_clean).strip()
        
        # 1. Direct match for common patterns (case-insensitive)
        # Look for "in [loc]", "at [loc]", "to [loc]", "near [loc]"
        # We capture until the end of the sentence or a punctuation
        # PRIORITIZE "in", "at", "near" to avoid capturing "to do in paris" as "do in paris"
        patterns = [
            r"(?:in|at|near|from)\s+([a-zA-Z\s]+)",
            r"(?:to|visit|for|about)\s+(?!go\b|do\b)([a-zA-Z\s]+)",
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text_clean)
            if match:
                # Get the captured group
                candidate = match.group(1).strip()
                # Filter out common stopwords that might be captured
                stopwords = ["please", "now", "today", "tomorrow", "me", "us"]
                if candidate not in stopwords:
                    # Capitalize for better presentation (e.g. "bangalore" -> "Bangalore")
                    return candidate.title()

        # 2. Fallback: If the input is short (likely just a place name), return it
        # e.g. "Bangalore", "Paris France", "Bangalore temperature"
        words = text_clean.split()
        if len(words) <= 3:
            # Assume the whole text is the location if it's short and not a command
            # Filter out "hi", "hello"
            if text_clean not in ["hi", "hello", "hey", ""]:
                return text_clean.title()
        
        # 3. Fallback: Look for capitalized words in the ORIGINAL text (if user used proper casing)
        # This preserves the old logic as a backup
        original_words = text.split()
        capitalized_words = []
        for word in original_words:
            clean_word = word.strip("?.!,")
            # Skip weather keywords
            if clean_word.lower() in weather_keywords:
                continue
            if clean_word and clean_word[0].isupper() and clean_word.lower() not in ["i", "i'm", "what", "where", "how", "let's", "the", "a"]:
                capitalized_words.append(clean_word)
        
        if capitalized_words:
            return " ".join(capitalized_words)
            
        return None
