import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const chatWithAgent = async (message, preferences = null) => {
    try {
        const response = await axios.post(`${API_URL}/chat`, {
            message,
            preferences
        });
        return response.data;
    } catch (error) {
        console.error('Error communicating with backend:', error);
        throw error;
    }
};
