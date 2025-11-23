import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, Maximize2, Minimize2 } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker for places
const placeIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const MapView = ({ center, places = [], zoom = 13 }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!center || !center.lat || !center.lon) {
        return null;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full mt-4"
        >
            <AnimatePresence mode="wait">
                {!isExpanded ? (
                    // Collapsed preview
                    <motion.div
                        key="collapsed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsExpanded(true)}
                        className="glass-card rounded-2xl p-4 cursor-pointer transition-colors border group"
                        style={{ borderColor: 'rgba(201, 169, 97, 0.2)' }}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(201, 169, 97, 0.2)' }}>
                                    <Map className="w-5 h-5" style={{ color: 'var(--accent-gold)' }} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold" style={{ color: 'var(--navy-primary)' }}>Interactive Map</h4>
                                    <p className="text-xs" style={{ color: 'var(--navy-secondary)' }}>Click to view {places.length} places on map</p>
                                </div>
                            </div>
                            <Maximize2 className="w-5 h-5 transition-colors" style={{ color: 'var(--navy-secondary)' }} />
                        </div>
                    </motion.div>
                ) : (
                    // Expanded map
                    <motion.div
                        key="expanded"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="glass-card rounded-2xl overflow-hidden border"
                        style={{ borderColor: 'rgba(201, 169, 97, 0.2)' }}
                    >
                        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'rgba(201, 169, 97, 0.2)' }}>
                            <div className="flex items-center gap-2">
                                <Map className="w-5 h-5" style={{ color: 'var(--accent-gold)' }} />
                                <h4 className="text-sm font-semibold" style={{ color: 'var(--navy-primary)' }}>{center.name || 'Location'}</h4>
                            </div>
                            <button
                                onClick={() => setIsExpanded(false)}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <Minimize2 className="w-4 h-4" style={{ color: 'var(--navy-secondary)' }} />
                            </button>
                        </div>
                        <div className="h-96">
                            <MapContainer
                                center={[center.lat, center.lon]}
                                zoom={zoom}
                                style={{ height: '100%', width: '100%' }}
                                className="z-0"
                            >
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />

                                {/* Center marker for the main location */}
                                <Marker position={[center.lat, center.lon]}>
                                    <Popup>
                                        <div className="text-sm font-medium text-gray-900">
                                            {center.name || 'Location'}
                                        </div>
                                    </Popup>
                                </Marker>

                                {/* Place markers */}
                                {places.map((place, index) => (
                                    place.lat && place.lon && (
                                        <Marker
                                            key={index}
                                            position={[place.lat, place.lon]}
                                            icon={placeIcon}
                                        >
                                            <Popup>
                                                <a
                                                    href={place.maps_link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm block no-underline text-inherit hover:text-inherit"
                                                >
                                                    <div className="font-semibold text-gray-900 flex items-center gap-1">
                                                        {place.name}
                                                    </div>
                                                    <div className="text-xs text-blue-600 font-medium mt-0.5">
                                                        Tap to open in Google Maps
                                                    </div>
                                                    <div className="text-xs text-gray-600 mt-1">{place.category}</div>
                                                    {place.description && (
                                                        <div className="text-xs text-gray-500 mt-1 max-w-xs line-clamp-3">
                                                            {place.description}
                                                        </div>
                                                    )}
                                                </a>
                                            </Popup>
                                        </Marker>
                                    )
                                ))}
                            </MapContainer>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default MapView;
