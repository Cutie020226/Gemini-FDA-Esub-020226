import React, { useState } from 'react';
import { Settings, FlowerStyle, LogEntry } from '../types';
import { generateContent } from '../services/geminiService';
import { Sparkles, ArrowRight } from 'lucide-react';

interface GenericAgentProps {
  title: string;
  systemPrompt: string;
  defaultInput: string;
  placeholder: string;
  settings: Settings;
  currentStyle: FlowerStyle;
  addLog: (log: Omit<LogEntry, 'id' | 'timestamp'>) => void;
  agentName: string;
}

const GenericAgent: React.FC<GenericAgentProps> = ({ 
  title, systemPrompt, defaultInput, placeholder, settings, currentStyle, addLog, agentName 
}) => {
  const [input, setInput] = useState(defaultInput);
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRun = async () => {
    if (!settings.apiKey) {
      alert("API Key required.");
      return;
    }
    setLoading(true);
    try {
      const res = await generateContent(settings.apiKey, settings.model, systemPrompt, input, settings.temperature);
      setOutput(res);
      addLog({
        tab: title,
        agent: agentName,
        model: settings.model,
        tokensEst: Math.ceil((input.length + res.length) / 4)
      });
    } catch (e) {
      console.error(e);
      setOutput("Error processing request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`p-6 rounded-xl shadow-lg border border-white/40 backdrop-blur-md ${currentStyle.card} h-full flex flex-col`}>
      <h2 className={`text-2xl font-bold mb-4 ${currentStyle.text}`}>{title}</h2>
      
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[400px]">
        <div className="flex flex-col">
          <label className={`text-sm font-semibold mb-2 ${currentStyle.text} opacity-80`}>Input</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 w-full p-4 rounded-lg bg-white/50 border border-gray-200 focus:ring-2 focus:ring-purple-300 outline-none font-mono text-sm resize-none"
            placeholder={placeholder}
          />
          <button 
            onClick={handleRun}
            disabled={loading}
            className={`mt-4 w-full py-3 rounded-lg font-bold shadow transition-all flex items-center justify-center gap-2 ${
              loading ? 'bg-gray-400' : `${currentStyle.accent.replace('text', 'bg')} text-white hover:opacity-90`
            }`}
          >
            {loading ? 'Thinking...' : <><Sparkles size={18} /> Process</>}
          </button>
        </div>

        <div className="flex flex-col">
          <label className={`text-sm font-semibold mb-2 ${currentStyle.text} opacity-80`}>AI Output</label>
          <div className="flex-1 w-full p-4 rounded-lg bg-white/80 border border-gray-200 overflow-auto text-sm font-medium text-gray-800">
            {output ? (
              <pre className="whitespace-pre-wrap font-sans">{output}</pre>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 italic">
                Result will appear here...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenericAgent;
