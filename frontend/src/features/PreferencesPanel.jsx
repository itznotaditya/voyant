import React, { useState, useEffect } from 'react';
import { X, Settings, Landmark, UtensilsCrossed, ShoppingBag, Theater, Castle, Trees } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = [
    { id: 'attractions', label: 'Attractions', Icon: Landmark },
    { id: 'food', label: 'Food & Dining', Icon: UtensilsCrossed },
    { id: 'shopping', label: 'Shopping', Icon: ShoppingBag },
    { id: 'entertainment', label: 'Entertainment', Icon: Theater },
    { id: 'historic', label: 'Historic Sites', Icon: Castle },
    { id: 'nature', label: 'Nature & Parks', Icon: Trees },
];

const PreferencesPanel = ({ isOpen, onClose, preferences, onPreferencesChange }) => {
    const [localPreferences, setLocalPreferences] = useState(preferences);

    useEffect(() => {
        setLocalPreferences(preferences);
    }, [preferences]);

    const handleToggleFilter = () => {
        const newPreferences = {
            ...localPreferences,
            filterEnabled: !localPreferences.filterEnabled,
            category_filter: !localPreferences.filterEnabled ? 'attractions' : localPreferences.category_filter
        };
        setLocalPreferences(newPreferences);
        onPreferencesChange(newPreferences);
        localStorage.setItem('tourism_assistant_preferences', JSON.stringify(newPreferences));
    };

    const handleCategoryChange = (categoryId) => {
        if (!localPreferences.filterEnabled) return;

        const newPreferences = { ...localPreferences, category_filter: categoryId };
        setLocalPreferences(newPreferences);
        onPreferencesChange(newPreferences);
        localStorage.setItem('tourism_assistant_preferences', JSON.stringify(newPreferences));
    };

    const handleReset = () => {
        const defaultPreferences = { filterEnabled: false, category_filter: 'attractions' };
        setLocalPreferences(defaultPreferences);
        onPreferencesChange(defaultPreferences);
        localStorage.removeItem('tourism_assistant_preferences');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                    />

                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-full w-full sm:w-[480px] border-l shadow-2xl z-50 overflow-y-auto"
                        style={{ background: 'var(--navy-primary)', borderColor: 'rgba(201, 169, 97, 0.2)' }}
                    >
                        <div className="sticky top-0 backdrop-blur-xl border-b p-6 flex items-center justify-between" style={{ background: 'rgba(26, 35, 50, 0.95)', borderColor: 'rgba(201, 169, 97, 0.2)' }}>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'var(--accent-gold)' }}>
                                    <Settings size={20} style={{ color: 'var(--navy-primary)' }} />
                                </div>
                                <h2 className="text-xl font-semibold" style={{ color: 'var(--beige-light)' }}>Preferences</h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
                            >
                                <X size={20} style={{ color: 'var(--beige-medium)' }} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="rounded-xl p-5 border" style={{ background: 'rgba(45, 62, 80, 0.5)', borderColor: 'rgba(201, 169, 97, 0.2)' }}>
                                <div className="flex items-center justify-between mb-2">
                                    <div>
                                        <h3 className="text-base font-semibold" style={{ color: 'var(--beige-light)' }}>Filter Places</h3>
                                        <p className="text-sm mt-1" style={{ color: 'var(--beige-medium)' }}>
                                            {localPreferences.filterEnabled
                                                ? 'Showing filtered results'
                                                : 'Showing all places (default)'}
                                        </p>
                                    </div>
                                    <button
                                        onClick={handleToggleFilter}
                                        className="relative w-14 h-8 rounded-full transition-colors"
                                        style={{ background: localPreferences.filterEnabled ? 'var(--accent-gold)' : '#4a5568' }}
                                    >
                                        <motion.div
                                            className="absolute top-1 w-6 h-6 rounded-full shadow-lg"
                                            style={{ background: localPreferences.filterEnabled ? 'var(--navy-primary)' : 'white' }}
                                            animate={{ left: localPreferences.filterEnabled ? '28px' : '4px' }}
                                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                        />
                                    </button>
                                </div>
                            </div>

                            <AnimatePresence>
                                {localPreferences.filterEnabled && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <h3 className="text-sm font-medium mb-4" style={{ color: 'var(--beige-medium)' }}>Select Category:</h3>
                                        <div className="grid grid-cols-2 gap-3">
                                            {CATEGORIES.map((category) => {
                                                const IconComponent = category.Icon;
                                                return (
                                                    <motion.button
                                                        key={category.id}
                                                        whileHover={{ scale: 1.03 }}
                                                        whileTap={{ scale: 0.97 }}
                                                        onClick={() => handleCategoryChange(category.id)}
                                                        className="relative p-4 rounded-xl transition-all border-2"
                                                        style={localPreferences.category_filter === category.id
                                                            ? { background: 'rgba(201, 169, 97, 0.2)', borderColor: 'var(--accent-gold)' }
                                                            : { background: 'rgba(45, 62, 80, 0.5)', borderColor: 'rgba(201, 169, 97, 0.1)' }
                                                        }
                                                    >
                                                        <div className="flex flex-col items-center gap-2">
                                                            <IconComponent className="w-7 h-7" style={{ color: 'var(--accent-gold)' }} />
                                                            <span className="text-sm font-medium text-center" style={{ color: 'var(--beige-light)' }}>
                                                                {category.label}
                                                            </span>
                                                        </div>
                                                        {localPreferences.category_filter === category.id && (
                                                            <div className="absolute top-2 right-2 w-2 h-2 rounded-full" style={{ background: 'var(--accent-gold)' }}></div>
                                                        )}
                                                    </motion.button>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <button
                                onClick={handleReset}
                                className="w-full py-3 px-4 hover:bg-[#3a3a3c] border rounded-xl text-sm font-medium transition-colors"
                                style={{ background: 'rgba(45, 62, 80, 0.5)', borderColor: 'rgba(201, 169, 97, 0.2)', color: 'var(--beige-light)' }}
                            >
                                Reset to Default
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default PreferencesPanel;
