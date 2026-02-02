import React from 'react';
import { Settings, FlowerStyle, AgentConfig } from '../types';
import { DEFAULT_AGENTS } from '../constants';

interface AgentsConfigProps {
  settings: Settings;
  currentStyle: FlowerStyle;
}

const AgentsConfig: React.FC<AgentsConfigProps> = ({ currentStyle }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className={`p-6 rounded-xl shadow-lg border border-white/40 backdrop-blur-md ${currentStyle.card}`}>
        <h2 className={`text-2xl font-bold mb-6 ${currentStyle.text}`}>Agents Configuration</h2>
        
        <div className="grid gap-4">
          {DEFAULT_AGENTS.map(agent => (
            <div key={agent.id} className="bg-white/50 p-4 rounded-lg border border-white/30">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-gray-800">{agent.name}</h3>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">{agent.category}</span>
              </div>
              <p className="text-xs text-gray-500 mb-2 font-mono">ID: {agent.id} | Model: {agent.model}</p>
              <div className="bg-gray-50 p-3 rounded text-sm text-gray-700 font-mono border border-gray-200">
                {agent.systemPrompt}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 text-center text-sm opacity-60">
          * Configuration is read-only in this demo version.
        </div>
      </div>
    </div>
  );
};

export default AgentsConfig;
