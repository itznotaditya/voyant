import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { chatWithAgent } from '../services/api';
import WeatherCard from './WeatherCard';
import PlacesCard from './PlacesCard';
import MapView from './MapView';
import HeroSection from './HeroSection';

const ChatInterface = ({ preferences, onOpenPreferences }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (messages.length > 0) {
            scrollToBottom();
        }
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = input;
        setInput('');
        setMessages(prev => [...prev, { type: 'user', text: userMessage }]);
        setLoading(true);

        try {
            const filterPreferences = preferences.filterEnabled
                ? { category_filter: preferences.category_filter }
                : { category_filter: 'all' };

            const response = await chatWithAgent(userMessage, filterPreferences);

            setMessages(prev => [...prev, {
                type: 'bot',
                text: response.text,
                data: response.data
            }]);
        } catch (error) {
            setMessages(prev => [...prev, { type: 'bot', text: "Sorry, I encountered an error. Please try again." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] max-w-7xl mx-auto">
            <div className="flex-1 overflow-y-auto space-y-6 mb-4 pr-2 scrollbar-thin pb-24">
                {messages.length === 0 ? (
                    <HeroSection onOpenPreferences={onOpenPreferences} />
                ) : (
                    <AnimatePresence mode="popLayout">
                        {messages.map((msg, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`flex gap-3 max-w-[85%] ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    {msg.type === 'bot' && (
                                        <div
                                            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-lg"
                                            style={{ background: 'var(--accent-gold)' }}
                                        >
                                            <Sparkles size={14} className="text-white" />
                                        </div>
                                    )}

                                    <div className="flex flex-col gap-2">
                                        <div
                                            className={`px-5 py-3.5 rounded-2xl text-[15px] leading-relaxed shadow-sm ${msg.type === 'user' ? 'text-white rounded-tr-sm' : 'rounded-tl-sm border'}`}
                                            style={msg.type === 'user'
                                                ? { background: 'var(--navy-primary)' }
                                                : { background: 'rgba(255, 255, 255, 0.95)', borderColor: 'rgba(201, 169, 97, 0.2)', color: 'var(--text-dark)' }
                                            }
                                        >
                                            <p className="whitespace-pre-wrap">{msg.text}</p>
                                        </div>

                                        {msg.data && (
                                            <div className="flex flex-col gap-4 mt-1">
                                                <div className="flex flex-wrap gap-4">
                                                    {msg.data.weather && <WeatherCard data={msg.data.weather} location={msg.data.location} />}
                                                    {msg.data.places && <PlacesCard places={msg.data.places} location={msg.data.location} />}
                                                </div>
                                                {(msg.data.places && msg.data.places.length > 0) && (
                                                    <MapView
                                                        center={{ lat: msg.data.lat, lon: msg.data.lon, name: msg.data.location }}
                                                        places={msg.data.places}
                                                    />
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}

                {loading && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-start"
                    >
                        <div className="flex gap-3">
                            <div
                                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-lg"
                                style={{ background: 'var(--accent-gold)' }}
                            >
                                <Sparkles size={14} className="text-white" />
                            </div>
                            <div
                                className="px-4 py-3 rounded-2xl rounded-tl-sm border flex items-center gap-2"
                                style={{ background: 'rgba(255, 255, 255, 0.95)', borderColor: 'rgba(201, 169, 97, 0.2)' }}
                            >
                                <Loader2 className="w-4 h-4 animate-spin" style={{ color: 'var(--accent-gold)' }} />
                                <span className="text-sm" style={{ color: 'var(--text-dark)' }}>Thinking...</span>
                            </div>
                        </div>
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="fixed bottom-8 left-0 right-0 px-4 z-40">
                <div className="max-w-7xl mx-auto">
                    <form onSubmit={handleSend} className="relative group">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about weather or places..."
                            className="w-full backdrop-blur-xl rounded-full pl-6 pr-14 py-4 focus:outline-none focus:ring-1 shadow-2xl border transition-all placeholder-gray-400"
                            style={{
                                background: 'rgba(255, 255, 255, 0.95)',
                                borderColor: 'rgba(201, 169, 97, 0.3)',
                                color: 'var(--text-dark)'
                            }}
                            disabled={loading}
                        />
                        <button
                            type="submit"
                            disabled={loading || !input.trim()}
                            className="absolute right-2 top-2 p-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                            style={{ background: 'var(--navy-primary)' }}
                        >
                            <Send size={18} className="text-white" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChatInterface;
