"""
Category configuration for tourist places filtering.
Maps user-friendly category names to OpenStreetMap tags.
"""

CATEGORY_MAPPINGS = {
    "all": None,  # No filtering, show all types
    
    "attractions": [
        ("tourism", "attraction"),
        ("tourism", "viewpoint"),
        ("historic", "monument"),
    ],
    
    "food": [
        ("amenity", "restaurant"),
        ("amenity", "cafe"),
        ("amenity", "bar"),
        ("amenity", "fast_food"),
    ],
    
    "shopping": [
        ("shop", "mall"),
        ("shop", "department_store"),
        ("amenity", "marketplace"),
        ("shop", "supermarket"),
    ],
    
    "entertainment": [
        ("amenity", "theatre"),
        ("amenity", "cinema"),
        ("tourism", "museum"),
        ("amenity", "arts_centre"),
        ("amenity", "nightclub"),
    ],
    
    "historic": [
        ("historic", "castle"),
        ("historic", "archaeological_site"),
        ("historic", "ruins"),
        ("historic", "memorial"),
        ("historic", "monument"),
    ],
    
    "nature": [
        ("leisure", "park"),
        ("leisure", "garden"),
        ("natural", "beach"),
        ("tourism", "zoo"),
        ("leisure", "nature_reserve"),
    ],
}

def get_category_display_name(category_key: str) -> str:
    """Get user-friendly display name for category."""
    display_names = {
        "all": "All Places",
        "attractions": "Attractions & Landmarks",
        "food": "Food & Dining",
        "shopping": "Shopping",
        "entertainment": "Entertainment & Culture",
        "historic": "Historic Sites",
        "nature": "Nature & Parks",
    }
    return display_names.get(category_key, "Places")
