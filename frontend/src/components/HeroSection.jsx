import React from 'react';
import { motion } from 'framer-motion';
import { Map, CloudSun, Settings, Sparkles } from 'lucide-react';

const HeroSection = ({ onOpenPreferences }) => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100
            }
        }
    };

    const features = [
        {
            icon: <Settings className="w-6 h-6 text-[var(--accent-gold)]" />,
            title: "Personalized Preferences",
            description: "Customize your results with filters for food, history, and more."
        },
        {
            icon: <Map className="w-6 h-6 text-[var(--accent-gold)]" />,
            title: "Interactive Maps",
            description: "Explore destinations with dynamic, clickable maps."
        },
        {
            icon: <CloudSun className="w-6 h-6 text-[var(--accent-gold)]" />,
            title: "Real-time Weather",
            description: "Live weather updates to help you pack right."
        },
        {
            icon: <Sparkles className="w-6 h-6 text-[var(--accent-gold)]" />,
            title: "Hidden Gems",
            description: "Discover local favorites beyond the tourist traps."
        }
    ];

    return (
        <motion.div
            className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 py-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants} className="mb-8">
                <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight drop-shadow-sm" style={{ color: 'var(--beige-light)' }}>
                    Voyant
                </h1>
                <p className="text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed mb-8" style={{ color: 'var(--beige-medium)' }}>
                    Your personal travel companion for smarter, deeper exploration.
                </p>

                <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onOpenPreferences}
                    className="px-8 py-4 rounded-full border-2 font-semibold flex items-center gap-2 mx-auto transition-all shadow-xl group cursor-pointer"
                    style={{
                        background: 'var(--accent-gold)',
                        borderColor: 'var(--accent-gold)',
                        color: 'var(--navy-primary)'
                    }}
                >
                    <Settings className="w-5 h-5 group-hover:rotate-45 transition-transform duration-500" />
                    Customize Your Experience
                </motion.button>
            </motion.div>

            <motion.div
                variants={itemVariants}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl w-full mt-8"
            >
                {features.map((feature, index) => (
                    <div
                        key={index}
                        className="p-6 rounded-2xl border text-left opacity-70 cursor-default"
                        style={{
                            background: 'rgba(245, 241, 232, 0.05)',
                            borderColor: 'rgba(201, 169, 97, 0.2)'
                        }}
                    >
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-xl" style={{ background: 'rgba(201, 169, 97, 0.2)' }}>
                                {feature.icon}
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--beige-light)' }}>{feature.title}</h3>
                                <p className="text-sm" style={{ color: 'var(--beige-medium)' }}>{feature.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </motion.div>
        </motion.div>
    );
};

export default HeroSection;
