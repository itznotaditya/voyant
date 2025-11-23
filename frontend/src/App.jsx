import React, { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import ChatInterface from './components/ChatInterface';
import PreferencesPanel from './features/PreferencesPanel';

function App() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [preferences, setPreferences] = useState({
    filterEnabled: false,
    category_filter: 'attractions'
  });

  // Load preferences from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('tourism_assistant_preferences');
    if (saved) {
      try {
        setPreferences(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load preferences:', e);
      }
    }
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <header className="fixed top-0 w-full z-50 glass-strong">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold tracking-tight text-[var(--text-light)]">
              Voyant
            </h1>
          </div>
          <button
            onClick={() => setIsPanelOpen(true)}
            className="w-9 h-9 rounded-full backdrop-blur-md border flex items-center justify-center transition-all hover:scale-105"
            style={{
              background: 'rgba(201, 169, 97, 0.2)',
              borderColor: 'rgba(201, 169, 97, 0.3)'
            }}
            title="Preferences"
          >
            <Settings size={18} className="text-[var(--accent-gold)]" />
          </button>
        </div>
      </header>

      <main className="pt-20 pb-10 px-4 relative z-10">
        <ChatInterface
          preferences={preferences}
          onOpenPreferences={() => setIsPanelOpen(true)}
        />
      </main>

      <PreferencesPanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        preferences={preferences}
        onPreferencesChange={setPreferences}
      />
    </div>
  );
}

export default App;
