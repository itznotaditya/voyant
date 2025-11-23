import httpx
import os
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv

load_dotenv()

class PlacesAgent:
    BASE_URL = "https://overpass-api.de/api/interpreter"
    WIKIPEDIA_API = "https://en.wikipedia.org/api/rest_v1/page/summary/"

    @staticmethod
    async def get_wikipedia_description(place_name: str, location: str = "") -> Optional[str]:
        """
        Fetch description from Wikipedia API with multiple search strategies.
        """
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                # Try multiple search strategies
                search_terms = [
                    place_name.replace(" ", "_"),
                    f"{place_name.replace(' ', '_')},_{location.replace(' ', '_')}" if location else None,
                    place_name.replace(" ", "_").replace(",", "")
                ]
                
                for search_term in search_terms:
                    if not search_term:
                        continue
                        
                    try:
                        response = await client.get(f"{PlacesAgent.WIKIPEDIA_API}{search_term}")
                        
                        if response.status_code == 200:
                            data = response.json()
                            extract = data.get("extract", "")
                            # Return first 3-4 complete sentences
                            if extract and len(extract) > 30:  # Ensure meaningful content
                                # Split by '. ' and keep sentences complete
                                sentences = extract.split(". ")
                                # Take 3-4 sentences and ensure we end with a period
                                num_sentences = min(4, len(sentences))
                                description = ". ".join(sentences[:num_sentences])
                                # Add final period if not present
                                if not description.endswith("."):
                                    description += "."
                                return description if len(description) > 30 else None
                    except:
                        continue
                        
                return None
        except Exception as e:
            print(f"Wikipedia API error for {place_name}: {e}")
            return None

    @staticmethod
    def generate_fallback_description(place_name: str, category: str) -> str:
        """
        Simple fallback when no description available.
        """
        return f"A notable {category.lower()} in the area worth visiting."


    @staticmethod
    def _haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """Calculate distance between two points in km"""
        import math
        R = 6371  # Earth radius in km
        
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        a = math.sin(dlat/2) * math.sin(dlat/2) + \
            math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * \
            math.sin(dlon/2) * math.sin(dlon/2)
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
        return R * c

    @staticmethod
    async def get_places(lat: float, lon: float, location_name: str = "", radius: int = 30000, category_filter: str = "all") -> List[Dict[str, Any]]:
        """
        Fetch tourist attractions near a given location using Overpass API (OSM).
        Returns detailed information including coordinates, category, and description.
        
        Args:
            lat: Latitude of the location
            lon: Longitude of the location
            location_name: Name of the location (for context)
            radius: Search radius in meters (default: 30km)
            category_filter: Category to filter by (all, attractions, food, shopping, entertainment, historic, nature)
        """
        # Import category mappings
        try:
            from features.categories import CATEGORY_MAPPINGS
        except ImportError:
            # Fallback if features module not available
            CATEGORY_MAPPINGS = {"all": None}
        
        # Build Overpass QL query based on category filter
        if category_filter == "all" or category_filter not in CATEGORY_MAPPINGS:
            # Default query - Expanded to include parks, castles, and peaks
            query = f"""
            [out:json];
            (
              node["tourism"="attraction"](around:{radius},{lat},{lon});
              way["tourism"="attraction"](around:{radius},{lat},{lon});
              relation["tourism"="attraction"](around:{radius},{lat},{lon});
              
              node["tourism"="museum"](around:{radius},{lat},{lon});
              way["tourism"="museum"](around:{radius},{lat},{lon});
              
              node["historic"="monument"](around:{radius},{lat},{lon});
              way["historic"="monument"](around:{radius},{lat},{lon});
              
              node["historic"="castle"](around:{radius},{lat},{lon});
              way["historic"="castle"](around:{radius},{lat},{lon});
              
              node["leisure"="park"](around:{radius},{lat},{lon});
              way["leisure"="park"](around:{radius},{lat},{lon});
              relation["leisure"="park"](around:{radius},{lat},{lon});
              
              node["leisure"="garden"](around:{radius},{lat},{lon});
              way["leisure"="garden"](around:{radius},{lat},{lon});
              
              node["natural"="peak"](around:{radius},{lat},{lon});
            );
            out center 500;
            """
        else:
            # Build query for specific category
            category_tags = CATEGORY_MAPPINGS[category_filter]
            query_parts = []
            
            for key, value in category_tags:
                query_parts.append(f'  node["{key}"="{value}"](around:{radius},{lat},{lon});')
                query_parts.append(f'  way["{key}"="{value}"](around:{radius},{lat},{lon});')
                query_parts.append(f'  relation["{key}"="{value}"](around:{radius},{lat},{lon});')
            
            query = f"""
            [out:json];
            (
{chr(10).join(query_parts)}
            );
            out center 500;
            """
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            try:
                response = await client.get(PlacesAgent.BASE_URL, params={"data": query})
                response.raise_for_status()
                data = response.json()
                
                valid_places_data = []
                category_counts = {}
                
                # First pass: Collect data and count categories for rarity score
                for element in data.get("elements", []):
                    tags = element.get("tags", {})
                    name = tags.get("name")
                    
                    if name:
                        # Get coordinates
                        if "lat" in element and "lon" in element:
                            place_lat, place_lon = element["lat"], element["lon"]
                        elif "center" in element:
                            place_lat, place_lon = element["center"]["lat"], element["center"]["lon"]
                        else:
                            continue
                        
                        # Determine category
                        category = tags.get("tourism") or tags.get("historic") or tags.get("amenity") or tags.get("shop") or tags.get("leisure") or tags.get("natural") or "attraction"
                        category_formatted = category.replace("_", " ").title()
                        
                        # Update counts for rarity heuristic
                        category_counts[category] = category_counts.get(category, 0) + 1
                        
                        valid_places_data.append({
                            "element": element,
                            "name": name,
                            "lat": place_lat,
                            "lon": place_lon,
                            "category": category,
                            "category_formatted": category_formatted,
                            "tags": tags
                        })
                
                places = []
                for p in valid_places_data:
                    # Calculate basic popularity score
                    popularity_score = PlacesAgent._calculate_popularity_score(
                        p["tags"], 
                        p["name"], 
                        p["lat"], 
                        p["lon"], 
                        lat, 
                        lon, 
                        p["category"], 
                        category_counts
                    )
                    
                    places.append({
                        "name": p["name"],
                        "lat": p["lat"],
                        "lon": p["lon"],
                        "category": p["category_formatted"],
                        "description": None,
                        "popularity_score": popularity_score
                    })
                
                # Sort by popularity score (highest first)
                places.sort(key=lambda x: x["popularity_score"], reverse=True)
                
                # Remove popularity_score from final output and return top 5
                # Also add Google Maps link
                final_places = []
                import urllib.parse
                
                for place in places[:5]:
                    # Generate Google Maps link
                    # Use name + location for better UX (shows name in search bar instead of coordinates)
                    query_string = f"{place['name']}"
                    if location_name:
                        query_string += f", {location_name}"
                    
                    encoded_query = urllib.parse.quote(query_string)
                    maps_link = f"https://www.google.com/maps/search/?api=1&query={encoded_query}"
                    
                    place_data = {
                        "name": place["name"],
                        "lat": place["lat"],
                        "lon": place["lon"],
                        "category": place["category"],
                        "description": place["description"],
                        "maps_link": maps_link
                    }
                    final_places.append(place_data)
                
                return final_places
            except Exception as e:
                import traceback
                traceback.print_exc()
                print(f"Error fetching places: {e}")
                return []

    @staticmethod
    def _calculate_popularity_score(tags: dict, name: str, lat: float, lon: float, search_lat: float, search_lon: float, category: str, category_counts: dict) -> float:
        """
        Calculate a popularity score (0-12 scale) based on multiple heuristics.
        """
        score = 0.0
        
        # 1. Category Weight
        # UNESCO / Heritage / Museum / Palace / Historic +3
        # Entertainment / Nature +2
        # Shopping +1
        tourism = tags.get("tourism", "")
        historic = tags.get("historic", "")
        amenity = tags.get("amenity", "")
        leisure = tags.get("leisure", "")
        shop = tags.get("shop", "")
        natural = tags.get("natural", "")
        
        if tags.get("heritage") or tags.get("unesco") or tourism == "museum" or historic in ["monument", "castle", "ruins", "memorial"]:
            score += 3
        elif tourism in ["theme_park", "zoo", "aquarium", "viewpoint"] or leisure in ["park", "garden"] or natural:
            score += 2
        elif shop or amenity in ["restaurant", "cafe", "marketplace"]:
            score += 1
            
        # 2. Name Length & Semantic Weight
        # Short names often = iconic (+1)
        # Keywords -> +2
        name_words = len(name.split())
        if name_words <= 3:
            score += 1
            
        keywords = ["Palace", "Museum", "Park", "Fort", "Temple", "Plaza", "Square", "Tower", "National", "Lake", "Aquarium", "Zoo", "Beach", "Gate", "Bridge", "Cathedral", "Basilica", "Market", "Garden", "Hills"]
        if any(keyword.lower() in name.lower() for keyword in keywords):
            score += 2
            
        # 3. Wikipedia Exists Check (+2)
        if tags.get("wikipedia") or tags.get("wikidata"):
            score += 2
            
        # 4. Proximity to Search Center
        # < 5km -> +2, 5-20km -> +1
        dist = PlacesAgent._haversine_distance(lat, lon, search_lat, search_lon)
        if dist < 5:
            score += 2
        elif 5 <= dist <= 20:
            score += 1
            
        # 5. Feature Richness in OSM Metadata
        # Count useful tags
        metadata_keys = ["opening_hours", "wheelchair", "website", "wikipedia", "ticket_price", "tourism", "phone", "email", "addr:street", "image"]
        metadata_count = sum(1 for k in metadata_keys if k in tags)
        if metadata_count >= 5:
            score += 2
        elif 2 <= metadata_count <= 4:
            score += 1
            
        # 6. Type Frequency Rarity Rule
        # Rare categories in the area are likely more important
        count = category_counts.get(category, 0)
        if count == 1:
            score += 3
        elif count <= 5:
            score += 2
        elif count <= 15:
            score += 1
            
        # 7. Famous Name Match (Manual Boost) - REMOVED as per user request
        # The scoring now relies on basic OSM data heuristics.
        
        return score

    @staticmethod
    def format_places_response(places: List[Dict[str, Any]], place_name: str, category_filter: str = "all") -> str:
        if not places:
            # Different messages for filtered vs unfiltered
            if category_filter != "all":
                try:
                    from features.categories import get_category_display_name
                    category_name = get_category_display_name(category_filter)
                    return f"I couldn't find any {category_name.lower()} in {place_name} within a 15km radius. Try selecting a different category or turning off the filter to see all places!"
                except ImportError:
                    return f"I couldn't find any places in that category in {place_name}. Try selecting a different category!"
            else:
                return f"I couldn't find any specific tourist attractions in {place_name}, but it's a great place to explore!"
        
        # Get category display name if filtering
        category_text = ""
        if category_filter != "all":
            try:
                from features.categories import get_category_display_name
                category_text = f" ({get_category_display_name(category_filter)})"
            except ImportError:
                pass
            
        formatted_places = "\n".join([f"- {place['name']} ({place['category']})" for place in places])
        return f"In {place_name} these are the places you can go{category_text}:\n\n{formatted_places}"
