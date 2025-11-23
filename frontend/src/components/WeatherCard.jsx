import React from 'react';
import { Cloud, Droplets, Wind, Thermometer, Sun, CloudRain } from 'lucide-react';
import { motion } from 'framer-motion';

const WeatherCard = ({ data, location }) => {
    if (!data) return null;

    const current = data.current || {};
    const temp = current.temperature_2m;

    // Get daily data for rain chance
    const daily = data.daily || {};
    const rainChance = daily.precipitation_probability_max ? daily.precipitation_probability_max[0] : 0;

    // Determine condition text and icon
    let condition = "Clear";
    let WeatherIcon = Sun;

    if (rainChance > 50) {
        condition = "Rainy";
        WeatherIcon = CloudRain;
    } else if (rainChance > 20) {
        condition = "Cloudy";
        WeatherIcon = Cloud;
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-2xl p-6 border shadow-lg max-w-sm w-full"
            style={{
                background: 'rgba(255, 255, 255, 0.98)',
                borderColor: 'rgba(201, 169, 97, 0.2)'
            }}
        >
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-3xl font-light tracking-tight" style={{ color: 'var(--navy-primary)' }}>{location}</h3>
                    <div className="flex items-center gap-2 mt-1">
                        <WeatherIcon className="w-4 h-4" style={{ color: 'var(--accent-gold)' }} />
                        <span className="text-sm font-medium uppercase tracking-wider" style={{ color: 'var(--navy-secondary)' }}>{condition}</span>
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <div className="text-5xl font-thin tracking-tighter" style={{ color: 'var(--navy-primary)' }}>
                        {Math.round(temp)}°
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4 border-t pt-4" style={{ borderColor: 'rgba(201, 169, 97, 0.2)' }}>
                <div className="flex flex-col items-center p-2 rounded-xl transition-colors" style={{ background: 'rgba(201, 169, 97, 0.1)' }}>
                    <Thermometer className="w-5 h-5 mb-1" style={{ color: 'var(--accent-gold)' }} />
                    <span className="text-xs" style={{ color: 'var(--navy-secondary)' }}>Feels Like</span>
                    <span className="text-sm font-semibold" style={{ color: 'var(--navy-primary)' }}>{Math.round(temp)}°</span>
                </div>
                <div className="flex flex-col items-center p-2 rounded-xl transition-colors" style={{ background: 'rgba(201, 169, 97, 0.1)' }}>
                    <Droplets className="w-5 h-5 mb-1" style={{ color: 'var(--accent-gold)' }} />
                    <span className="text-xs" style={{ color: 'var(--navy-secondary)' }}>Chance Rain</span>
                    <span className="text-sm font-semibold" style={{ color: 'var(--navy-primary)' }}>{rainChance}%</span>
                </div>
                <div className="flex flex-col items-center p-2 rounded-xl transition-colors" style={{ background: 'rgba(201, 169, 97, 0.1)' }}>
                    <Wind className="w-5 h-5 mb-1" style={{ color: 'var(--accent-gold)' }} />
                    <span className="text-xs" style={{ color: 'var(--navy-secondary)' }}>Wind</span>
                    <span className="text-sm font-semibold" style={{ color: 'var(--navy-primary)' }}>{current.wind_speed_10m || 0} km/h</span>
                </div>
            </div>
        </motion.div>
    );
};

export default WeatherCard;
