# Voyant

A travel planning app that combines weather data, place recommendations, and interactive maps. Built with FastAPI and React.

![Python](https://img.shields.io/badge/Python-3.11+-1a2332?style=flat-square&logo=python)
![React](https://img.shields.io/badge/React-19-1a2332?style=flat-square&logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104-c9a961?style=flat-square&logo=fastapi)

## Features

- **Real-time weather data** - Current conditions and forecasts from Open-Meteo
- **Smart place discovery** - Attractions, restaurants, and points of interest from OpenStreetMap
- **Interactive maps** - Explore locations with clickable Leaflet maps
- **Category filtering** - Filter by attractions, food, shopping, entertainment, historic sites, or nature
- **Natural language queries** - Just ask naturally like "What's the weather in Paris?" or "Show me things to do in Tokyo"
- **Responsive design** - Works seamlessly on desktop, tablet, and mobile
- **No API keys required** - Uses free, open-source APIs

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+

### Installation

Clone the repo:
```bash
git clone https://github.com/itznotaditya/voyant.git
cd voyant
```

Backend setup:
```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
```

Frontend setup:
```bash
cd frontend
npm install
```

### Running

Start the backend (from `backend/` directory):
```bash
python main.py
```

Start the frontend (from `frontend/` directory):
```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

## Project Structure

```
voyant/
├── backend/
│   ├── agents/              # Query orchestration and AI agents
│   ├── features/            # Category mappings
│   ├── utils/               # Geocoding utilities
│   ├── main.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── features/        # Feature modules
│   │   └── services/        # API client
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Tech Stack

**Backend:** FastAPI, Uvicorn, httpx, Pydantic  
**Frontend:** React 19, Vite, Tailwind CSS, Framer Motion, Leaflet, Lucide Icons

**APIs:**
- Open-Meteo (weather)
- OpenStreetMap Overpass API (places)
- Nominatim (geocoding)
- Wikipedia REST API (descriptions)

## Usage

**🌤️ Ask about weather:**
```
What's the weather in Paris?
```

**🗺️ Discover places:**
```
Show me attractions in Tokyo
Things to do in Barcelona
```

**🔄 Combined queries:**
```
Weather and places to visit in London
```

**⚙️ Use category filters:**
- Click the settings icon in the top right
- Select a category (food, historic sites, nature, shopping, entertainment, or attractions)
- Your results will be filtered to show only places in that category

**🗺️ Explore with maps:**
- Each place result shows a small map preview
- Click on any map to open an interactive full-screen view
- Click markers to see place details
- Pan and zoom to explore the area

Use the settings icon to filter by category (food, historic sites, nature, etc.). Click on map previews to explore locations interactively.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

## License

MIT - see [LICENSE](LICENSE) for details.

## Acknowledgments

- Weather data from [Open-Meteo](https://open-meteo.com/)
- Map data from [OpenStreetMap](https://www.openstreetmap.org/) contributors
- Icons by [Lucide](https://lucide.dev/)
