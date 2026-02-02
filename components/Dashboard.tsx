import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { LogEntry, Settings, FlowerStyle } from '../types';
import { LABELS } from '../constants';
import { Activity, Zap, FileText } from 'lucide-react';

interface DashboardProps {
  logs: LogEntry[];
  settings: Settings;
  currentStyle: FlowerStyle;
}

const Dashboard: React.FC<DashboardProps> = ({ logs, settings, currentStyle }) => {
  const t = (key: keyof typeof LABELS) => LABELS[key][settings.language];

  // Aggregate data for charts
  const tabData = logs.reduce((acc, log) => {
    acc[log.tab] = (acc[log.tab] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.keys(tabData).map(key => ({
    name: key,
    runs: tabData[key]
  }));

  const totalTokens = logs.reduce((sum, log) => sum + log.tokensEst, 0);

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className={`p-6 rounded-xl shadow-lg border border-white/40 backdrop-blur-md ${currentStyle.card} flex items-center justify-between`}>
      <div>
        <p className={`text-sm font-medium uppercase tracking-wider opacity-70 ${currentStyle.text}`}>{title}</p>
        <h2 className={`text-3xl font-bold mt-1 ${currentStyle.text}`}>{value}</h2>
      </div>
      <div className={`p-4 rounded-full ${color} bg-opacity-20`}>
        <Icon size={24} className={currentStyle.accent} />
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className={`text-3xl font-bold ${currentStyle.text}`}>{t('Dashboard')}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Runs" 
          value={logs.length} 
          icon={Activity} 
          color="bg-blue-500" 
        />
        <StatCard 
          title="Est. Tokens" 
          value={totalTokens.toLocaleString()} 
          icon={Zap} 
          color="bg-amber-500" 
        />
        <StatCard 
          title="Unique Tabs" 
          value={Object.keys(tabData).length} 
          icon={FileText} 
          color="bg-purple-500" 
        />
      </div>

      <div className={`p-6 rounded-xl shadow-lg border border-white/40 backdrop-blur-md ${currentStyle.card}`}>
        <h3 className={`text-lg font-semibold mb-6 ${currentStyle.text}`}>Activity by Tab</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="name" stroke="#666" fontSize={12} />
              <YAxis stroke="#666" fontSize={12} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="runs" fill="#8884d8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={`p-6 rounded-xl shadow-lg border border-white/40 backdrop-blur-md ${currentStyle.card}`}>
        <h3 className={`text-lg font-semibold mb-4 ${currentStyle.text}`}>Recent Logs</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase opacity-70 border-b border-gray-200/50">
              <tr>
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">Agent</th>
                <th className="px-4 py-3">Model</th>
                <th className="px-4 py-3">Tokens</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/30">
              {logs.slice().reverse().slice(0, 5).map(log => (
                <tr key={log.id} className="hover:bg-black/5">
                  <td className="px-4 py-3 opacity-80">{new Date(log.timestamp).toLocaleTimeString()}</td>
                  <td className="px-4 py-3 font-medium">{log.agent}</td>
                  <td className="px-4 py-3 opacity-80">{log.model}</td>
                  <td className="px-4 py-3 opacity-80">{log.tokensEst}</td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center opacity-50">No activity yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
