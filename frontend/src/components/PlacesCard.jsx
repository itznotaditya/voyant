import React from 'react';
import { MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const PlacesCard = ({ places, location }) => {
    if (!places || places.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="w-full mt-4"
        >
            <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(201, 169, 97, 0.2)' }}>
                    <MapPin className="w-4 h-4" style={{ color: 'var(--accent-gold)' }} />
                </div>
                <h3 className="text-lg font-semibold" style={{ color: 'var(--beige-light)' }}>Top Places in {location}</h3>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {places.map((place, index) => (
                    <motion.div
                        key={index}
                        whileHover={{ scale: 1.01, x: 4 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="glass-card rounded-2xl p-5 border border-white/5"
                    >
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-sm font-bold rounded-full" style={{ background: 'rgba(201, 169, 97, 0.2)', color: 'var(--accent-gold)' }}>
                                {index + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-lg font-semibold mb-1" style={{ color: 'var(--navy-primary)' }}>
                                    {place.name || place}
                                </h4>
                                {place.category && (
                                    <div className="inline-block px-2 py-1 text-xs font-medium rounded-full" style={{ background: 'rgba(201, 169, 97, 0.15)', color: 'var(--accent-gold)' }}>
                                        {place.category}
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default PlacesCard;
