import React, { useState, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TwPremarket from './components/TwPremarket';
import GenericAgent from './components/GenericAgent';
import AgentsConfig from './components/AgentsConfig';
import { Settings, FlowerStyle, LogEntry } from './types';
import { FLOWER_STYLES, LABELS } from './constants';
import { Menu, X } from 'lucide-react';

const App: React.FC = () => {
  // Check for Env Key
  const envKey = process.env.API_KEY || '';
  
  const [settings, setSettings] = useState<Settings>({
    language: 'English',
    theme: 'Light',
    styleName: 'Rose',
    apiKey: envKey,
    model: 'gemini-2.5-flash',
    temperature: 0.2
  });

  const [activeTab, setActiveTab] = useState('Dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  // Get current style object
  const currentStyle = useMemo(() => 
    FLOWER_STYLES.find(s => s.name === settings.styleName) || FLOWER_STYLES[0], 
    [settings.styleName]
  );

  const addLog = (log: Omit<LogEntry, 'id' | 'timestamp'>) => {
    const newLog: LogEntry = {
      ...log,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString()
    };
    setLogs(prev => [...prev, newLog]);
  };

  const t = (key: keyof typeof LABELS) => LABELS[key][settings.language];

  // Tab definitions
  const TABS = [
    { id: 'Dashboard', label: t('Dashboard') },
    { id: 'TwPremarket', label: t('TwPremarket') },
    { id: 'FiveTenK', label: t('FiveTenK') },
    { id: 'PdfToMd', label: t('PdfToMd') },
    { id: 'Notes', label: t('Notes') },
    { id: 'Config', label: t('Config') },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return <Dashboard logs={logs} settings={settings} currentStyle={currentStyle} />;
      case 'TwPremarket':
        return <TwPremarket settings={settings} currentStyle={currentStyle} addLog={addLog} />;
      case 'FiveTenK':
        return (
          <GenericAgent 
            title={t('FiveTenK')}
            agentName="510(k) Analyst"
            systemPrompt="You are an FDA 510(k) analyst. Summarize the device information, predicate comparisons, and testing requirements."
            defaultInput="Device: New MRI System\nPredicate: K123456\nTech: 1.5T Magnet..."
            placeholder="Enter device details, predicate info..."
            settings={settings}
            currentStyle={currentStyle}
            addLog={addLog}
          />
        );
      case 'PdfToMd':
        return (
          <GenericAgent 
            title={t('PdfToMd')}
            agentName="PDF Converter"
            systemPrompt="You are a document converter. Convert the provided raw text (extracted from PDF) into clean, structured Markdown format."
            defaultInput=""
            placeholder="Paste raw text extracted from PDF here..."
            settings={settings}
            currentStyle={currentStyle}
            addLog={addLog}
          />
        );
      case 'Notes':
        return (
          <GenericAgent 
            title={t('Notes')}
            agentName="Note Organizer"
            systemPrompt="Organize the following messy notes into a structured report. Highlight Action Items and Risks."
            defaultInput=""
            placeholder="Paste rough meeting notes or review comments..."
            settings={settings}
            currentStyle={currentStyle}
            addLog={addLog}
          />
        );
      case 'Config':
        return <AgentsConfig settings={settings} currentStyle={currentStyle} />;
      default:
        return <div>Not Implemented</div>;
    }
  };

  return (
    <div className={`flex h-screen w-full transition-colors duration-500 overflow-hidden ${currentStyle.gradient} ${settings.theme === 'Dark' ? 'brightness-90 invert-[0.05]' : ''}`}>
      
      {/* Sidebar - Desktop */}
      <div className="hidden md:block w-72 h-full z-10 shadow-2xl">
        <Sidebar 
          settings={settings} 
          setSettings={setSettings} 
          currentStyle={currentStyle}
          isEnvKey={!!envKey}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full relative overflow-hidden">
        
        {/* Header / Tabs */}
        <header className={`h-16 flex items-center justify-between px-6 backdrop-blur-md border-b border-white/20 ${currentStyle.sidebar} z-20`}>
          <div className="flex items-center gap-4">
             <button 
               className="md:hidden p-2 rounded-lg bg-white/20 text-gray-800"
               onClick={() => setMobileMenuOpen(true)}
             >
               <Menu size={24} />
             </button>
             <h2 className={`font-bold text-lg hidden sm:block ${currentStyle.text}`}>
               {TABS.find(tab => tab.id === activeTab)?.label}
             </h2>
          </div>

          <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar py-2 max-w-full">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id 
                    ? `bg-white shadow-sm ${currentStyle.accent.replace('text', 'text')}` 
                    : `text-gray-600 hover:bg-white/30`
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative z-0">
          <div className="max-w-6xl mx-auto h-full">
            {renderContent()}
          </div>
        </main>

        {/* Mobile Sidebar Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex">
            <div className="w-80 h-full bg-white shadow-2xl relative">
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="absolute top-4 right-4 p-2 text-gray-500"
              >
                <X size={24} />
              </button>
              <Sidebar 
                settings={settings} 
                setSettings={setSettings} 
                currentStyle={currentStyle}
                isEnvKey={!!envKey}
              />
            </div>
            <div className="flex-1 bg-black/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
