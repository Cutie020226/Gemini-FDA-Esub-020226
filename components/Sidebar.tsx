import React from 'react';
import { Settings, FlowerStyle, Language, Theme } from '../types';
import { FLOWER_STYLES, LABELS } from '../constants';
import { Settings2, Dice5, Key, Sun, Moon, Globe } from 'lucide-react';

interface SidebarProps {
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
  currentStyle: FlowerStyle;
  isEnvKey: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ settings, setSettings, currentStyle, isEnvKey }) => {
  const t = (key: keyof typeof LABELS) => LABELS[key][settings.language];

  const handleJackpot = () => {
    const randomIndex = Math.floor(Math.random() * FLOWER_STYLES.length);
    setSettings(prev => ({ ...prev, styleName: FLOWER_STYLES[randomIndex].name }));
  };

  return (
    <div className={`h-full flex flex-col p-6 backdrop-blur-md border-r border-white/20 ${currentStyle.sidebar} transition-colors duration-500`}>
      <h1 className={`text-2xl font-bold mb-8 ${currentStyle.accent}`}>
        Flora<span className={currentStyle.text}>Agentic</span>
      </h1>

      <div className="space-y-8 flex-1 overflow-y-auto">
        {/* Theme & Language */}
        <section className="space-y-4">
          <h3 className={`text-xs font-bold uppercase tracking-wider opacity-70 ${currentStyle.text}`}>
            {t('Config')}
          </h3>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sun size={16} className={currentStyle.text} />
              <span className={`text-sm ${currentStyle.text}`}>{t('Theme')}</span>
            </div>
            <div className="flex bg-white/30 rounded-full p-1">
              {(['Light', 'Dark'] as Theme[]).map(mode => (
                <button
                  key={mode}
                  onClick={() => setSettings(s => ({ ...s, theme: mode }))}
                  className={`px-3 py-1 rounded-full text-xs transition-all ${
                    settings.theme === mode 
                      ? 'bg-white shadow-sm font-semibold' 
                      : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe size={16} className={currentStyle.text} />
              <span className={`text-sm ${currentStyle.text}`}>{t('Language')}</span>
            </div>
            <select
              value={settings.language}
              onChange={(e) => setSettings(s => ({ ...s, language: e.target.value as Language }))}
              className="bg-white/40 border-none rounded text-xs p-1 focus:ring-2 focus:ring-opacity-50"
            >
              <option value="English">English</option>
              <option value="繁體中文">繁體中文</option>
            </select>
          </div>
        </section>

        {/* Style Selector */}
        <section className="space-y-3">
          <h3 className={`text-xs font-bold uppercase tracking-wider opacity-70 ${currentStyle.text}`}>
            {t('Style')}
          </h3>
          <select 
            className="w-full p-2 rounded-lg bg-white/40 border border-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
            value={settings.styleName}
            onChange={(e) => setSettings(s => ({ ...s, styleName: e.target.value }))}
          >
            {FLOWER_STYLES.map(s => (
              <option key={s.name} value={s.name}>{s.name}</option>
            ))}
          </select>
          <button 
            onClick={handleJackpot}
            className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-white/50 hover:bg-white/70 transition-all text-sm font-semibold shadow-sm ${currentStyle.accent}`}
          >
            <Dice5 size={18} />
            {t('Jackpot')}
          </button>
        </section>

        {/* API Key */}
        <section className="space-y-3">
          <h3 className={`text-xs font-bold uppercase tracking-wider opacity-70 ${currentStyle.text}`}>
            API Key (Gemini)
          </h3>
          <div className="relative">
            <Key size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${currentStyle.text} opacity-50`} />
            {isEnvKey ? (
               <input 
               type="text" 
               disabled
               value={t('KeySet')}
               className="w-full pl-9 p-2 rounded-lg bg-green-500/20 text-green-800 text-sm font-semibold border border-green-500/30 cursor-not-allowed"
             />
            ) : (
              <input 
                type="password" 
                placeholder={t('InputKey')}
                value={settings.apiKey}
                onChange={(e) => setSettings(s => ({ ...s, apiKey: e.target.value }))}
                className="w-full pl-9 p-2 rounded-lg bg-white/40 border border-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 placeholder:text-gray-500"
              />
            )}
          </div>
          <p className="text-[10px] opacity-60 leading-tight">
            *Uses Gemini 2.5 Flash by default. The key is never stored on a server.
          </p>
        </section>
      </div>
      
      <div className="text-[10px] opacity-50 text-center mt-4">
        v1.0.0 • React Agentic System
      </div>
    </div>
  );
};

export default Sidebar;
