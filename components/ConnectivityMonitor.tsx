
import React, { useState, useEffect } from 'react';
import { Activity, Globe, Zap, ShieldCheck, ServerCrash } from 'lucide-react';
import { diagnoseConnectivity } from '../services/geminiService';

interface NodePing {
  id: string;
  linkName: string;
  latency: number;
  successRate: number;
  lastSeen: string;
}

export const ConnectivityMonitor: React.FC = () => {
  const [nodes, setNodes] = useState<NodePing[]>([
    { id: 'DM', linkName: 'LOCAL_DM', latency: 12, successRate: 100, lastSeen: 'Just Now' },
    { id: 'DS', linkName: 'DL_DUBAI_STAT', latency: 45, successRate: 99.8, lastSeen: 'Just Now' },
    { id: 'TS', linkName: 'DL_TANZANIA_PORT', latency: 185, successRate: 98.2, lastSeen: 'Just Now' },
    { id: 'KS', linkName: 'DL_KENYA_PORT', latency: 215, successRate: 97.5, lastSeen: 'Just Now' },
  ]);
  const [diagnostic, setDiagnostic] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setNodes(prev => prev.map(node => {
        const isDown = node.id === 'KS' && Math.random() > 0.98;
        return {
          ...node,
          latency: isDown ? 0 : Math.max(10, node.latency + (Math.random() * 20 - 10)),
          successRate: Math.min(100, Math.max(90, node.successRate + (Math.random() * 0.4 - 0.2))),
          lastSeen: new Date().toLocaleTimeString(),
        };
      }));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const runDeepDiagnostic = async () => {
    setIsLoading(true);
    const result = await diagnoseConnectivity(nodes);
    setDiagnostic(result);
    setIsLoading(false);
  };

  return (
    <div className="apex-region mb-6 overflow-hidden border-slate-300 shadow-lg">
      <div className="bg-[#1e293b] p-3 flex items-center justify-between text-white border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></div>
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            Network Topology & DB Link Handshakes
          </span>
        </div>
        <button 
          onClick={runDeepDiagnostic}
          disabled={isLoading}
          className="bg-[#0066cc] hover:bg-blue-500 text-[9px] font-bold px-4 py-1.5 rounded uppercase transition-all flex items-center gap-2 shadow-inner"
        >
          <Zap size={10} fill="currentColor" /> {isLoading ? 'Pinging Links...' : 'Verify DB Links'}
        </button>
      </div>
      
      <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-50 border-b border-slate-200">
        {nodes.map((node) => (
          <div key={node.id} className="bg-white border border-slate-200 p-3 rounded shadow-sm hover:border-blue-400 transition-colors relative group">
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="text-[10px] font-bold text-blue-600 font-mono tracking-tighter">{node.linkName}</div>
                <div className="text-[13px] font-black text-slate-800">{node.id} NODE</div>
              </div>
              {node.latency === 0 ? (
                <ServerCrash size={16} className="text-red-500 animate-pulse" />
              ) : (
                <ShieldCheck size={16} className="text-green-500" />
              )}
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-bold text-slate-400 uppercase">Latency</span>
                <span className={`text-[11px] font-mono font-bold ${node.latency === 0 ? 'text-red-500' : node.latency > 150 ? 'text-amber-500' : 'text-green-600'}`}>
                  {node.latency === 0 ? 'FAIL' : `${Math.round(node.latency)}ms`}
                </span>
              </div>
              <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${node.latency === 0 ? 'w-0' : node.latency > 150 ? 'bg-amber-500' : 'bg-green-500'}`}
                  style={{ width: node.latency === 0 ? '0%' : `${Math.max(20, 100 - (node.latency/3))}%` }}
                />
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-[8px] font-bold text-slate-400 uppercase">Packet Success</span>
                <span className="text-[9px] font-bold text-slate-600">{node.successRate.toFixed(1)}%</span>
              </div>
            </div>
            
            <div className="mt-2 pt-2 border-t border-slate-50 text-[8px] text-slate-300 font-medium flex items-center gap-1">
              <Globe size={8} /> LAST SYNC: {node.lastSeen}
            </div>
          </div>
        ))}
      </div>

      {diagnostic && (
        <div className="p-3 bg-slate-900 text-blue-300 text-[10px] flex items-center gap-4 animate-in slide-in-from-bottom-2 duration-500">
          <div className="flex items-center gap-2 border-r border-slate-700 pr-4">
            <span className="text-slate-500 font-bold uppercase tracking-widest">Confidence</span>
            <span className="text-blue-400 font-black text-sm">{diagnostic.score}%</span>
          </div>
          <div className="flex-1 flex items-center gap-2">
            <Activity size={14} className="text-blue-500" />
            <span className="font-mono">{diagnostic.logEntry}</span>
          </div>
          <div className={`px-3 py-1 rounded font-black border ${
            diagnostic.riskLevel === 'High' ? 'bg-red-900/30 border-red-500 text-red-400' : 'bg-green-900/30 border-green-500 text-green-400'
          }`}>
            RISK: {diagnostic.riskLevel}
          </div>
        </div>
      )}
    </div>
  );
};
