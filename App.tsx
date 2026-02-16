
import React, { useState, useEffect, useMemo } from 'react';
import { SyncRecord, SyncFlag, DataCategory, SyncRule } from './types';
import { generateMockRecords, MOCK_RECORDS } from './mockData';
import { SERVER_NODES } from './constants';
import { KpiCards } from './components/KpiCards';
import { ServerSummaryCards } from './components/ServerSummaryCards';
import { DataPipe } from './components/DataPipe';
import { RouteCards } from './components/RouteCards';
import { ExceptionGrid } from './components/ExceptionGrid';
import { SqlReference } from './components/SqlReference';
import { ConnectivityMonitor } from './components/ConnectivityMonitor';
import { analyzeSyncHealth } from './services/geminiService';
import { 
  Database, Search, RefreshCw, Menu, ChevronRight, BrainCircuit, Terminal, LayoutDashboard, Radio
} from 'lucide-react';

const App: React.FC = () => {
  const [records, setRecords] = useState<SyncRecord[]>(MOCK_RECORDS);
  const [categoryFilter, setCategoryFilter] = useState<DataCategory | 'All'>('All');
  const [ruleFilter, setRuleFilter] = useState<SyncRule | 'All'>('All');
  const [showSql, setShowSql] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLive, setIsLive] = useState(true);
  const [aiInsight, setAiInsight] = useState<{summary: string, recommendation: string} | null>(null);

  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      const matchCat = categoryFilter === 'All' || r.category === categoryFilter;
      const matchRule = ruleFilter === 'All' || r.rule === ruleFilter;
      return matchCat && matchRule;
    });
  }, [records, categoryFilter, ruleFilter]);

  const activeNodesCount = SERVER_NODES.filter(n => n.status === 'Active').length;

  // Real-time "Feel" - New data arriving periodically
  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      const newRecord = generateMockRecords(1)[0];
      setRecords(prev => [newRecord, ...prev.slice(0, 199)]);
    }, 8000);
    return () => clearInterval(interval);
  }, [isLive]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setRecords(generateMockRecords(150));
      setIsRefreshing(false);
    }, 800);
  };

  const handleForceSync = (id: string) => {
    setRecords(prev => prev.map(r => {
      if (r.id === id) {
        let newFlag = r.flag;
        if (r.flag === SyncFlag.DUBAI_UNPROCESSED) newFlag = SyncFlag.DUBAI_IN_TRANSIT;
        else if (r.flag === SyncFlag.PORT_UNPROCESSED) newFlag = SyncFlag.PORT_IN_TRANSIT;
        return { ...r, flag: newFlag, lastModified: new Date().toISOString() };
      }
      return r;
    }));
  };

  useEffect(() => {
    analyzeSyncHealth(records).then(setAiInsight);
  }, [records.length]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="h-12 bg-[#0066cc] flex items-center px-4 justify-between text-white shadow-md z-30">
        <div className="flex items-center gap-4">
          <Menu size={20} className="cursor-pointer" />
          <div className="flex items-center gap-2 font-bold text-sm">
            <Database size={18} />
            <span>ORACLE APEX</span>
            <span className="font-light opacity-30">|</span>
            <span className="text-blue-100 uppercase tracking-tighter">SyncMonitor Live Pro v5.0</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all ${isLive ? 'bg-green-600/20 border-green-400 text-green-300' : 'bg-slate-700/50 border-slate-500 text-slate-400'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-green-400 animate-pulse' : 'bg-slate-400'}`}></span>
            {isLive ? 'LIVE FEED CONNECTED' : 'FEED PAUSED'}
          </div>
          <div className="w-7 h-7 rounded-full bg-blue-500 border border-blue-300 flex items-center justify-center font-bold shadow-inner">A</div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Filters */}
        <aside className="w-64 bg-white border-r border-slate-200 overflow-y-auto hidden lg:block shadow-[1px_0_5px_rgba(0,0,0,0.03)]">
          <div className="p-4 bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Search size={14} /> System Parameters
          </div>
          <div className="p-5 space-y-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-800 uppercase">Live Connectivity</span>
              <button 
                onClick={() => setIsLive(!isLive)}
                className={`w-10 h-5 rounded-full relative transition-colors ${isLive ? 'bg-blue-600' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${isLive ? 'left-6' : 'left-1'}`} />
              </button>
            </div>

            <div>
              <h4 className="text-[11px] font-bold text-slate-800 uppercase mb-3 border-b border-slate-100 pb-1">Data Category</h4>
              <div className="space-y-2">
                {['All', DataCategory.MASTER, DataCategory.TRANSACTION].map((cat) => (
                  <label key={cat} className="flex items-center gap-2 cursor-pointer group">
                    <input type="radio" checked={categoryFilter === cat} onChange={() => setCategoryFilter(cat as any)} className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500" />
                    <span className={`text-sm transition-colors ${categoryFilter === cat ? 'text-blue-600 font-bold' : 'text-slate-600 group-hover:text-blue-500'}`}>{cat === 'All' ? 'Full Cluster' : cat}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <button onClick={() => setShowSql(!showSql)} className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-900 text-blue-300 text-[10px] font-bold rounded uppercase hover:bg-black transition-all shadow-lg shadow-blue-900/10">
              <Terminal size={14} /> {showSql ? 'Hide Logic' : 'Inspect SQL'}
            </button>
          </div>
        </aside>

        {/* Dashboard Area */}
        <div className="flex-1 overflow-y-auto bg-[#f0f2f5]">
          <div className="bg-white border-b border-slate-200 px-8 py-3 flex items-center justify-between sticky top-0 z-20 shadow-sm">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
              <LayoutDashboard size={14} /> <span>Live Monitor</span> <ChevronRight size={12} /> <span className="text-slate-900 font-bold">Data Connectivity & Sync</span>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={handleRefresh} className="bg-[#0066cc] text-white px-5 py-2 rounded text-[11px] font-bold flex items-center gap-2 hover:bg-blue-700 active:scale-95 transition-all shadow-md">
                <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} /> RE-FETCH CLUSTER
              </button>
            </div>
          </div>

          <div className="p-8 max-w-[1600px] mx-auto space-y-8">
            {/* New Connectivity Monitor Section */}
            <ConnectivityMonitor />

            {/* Row 1: Server Summary Cards (Node View) */}
            <section>
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span> Server Availability & Load
              </h4>
              <ServerSummaryCards records={filteredRecords} />
            </section>

            {/* Row 2: Global KPI Cards */}
            <KpiCards records={filteredRecords} activeNodes={activeNodesCount} />

            {/* AI Insights (APEX Alert Style) */}
            {aiInsight && (
              <div className="bg-white border-l-4 border-blue-600 p-5 shadow-sm flex gap-5 animate-in fade-in slide-in-from-right-4 duration-700 rounded-r-md border border-slate-200">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-full h-fit mt-1">
                  <BrainCircuit size={24} />
                </div>
                <div>
                  <h5 className="text-[10px] font-bold text-blue-900 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                    Predictive Infrastructure Insight <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-[8px] border border-blue-200">AI GEN</span>
                  </h5>
                  <p className="text-sm text-slate-700 leading-relaxed font-medium">{aiInsight.summary}</p>
                  <div className="inline-block mt-3 px-3 py-1 bg-slate-900 text-white text-[10px] font-bold rounded uppercase">
                    Admin Recommended Action: {aiInsight.recommendation}
                  </div>
                </div>
              </div>
            )}

            {showSql && <SqlReference />}

            {/* Row 3: Aggregate Pipe Visuals */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DataPipe 
                title="Dubai Core Pipe (TN → TS → TY)" 
                records={filteredRecords.filter(r => r.destination === 'DS')} 
                type="Dubai" 
              />
              <DataPipe 
                title="Port Core Pipe (UN → US → UY)" 
                records={filteredRecords.filter(r => (r.source === 'TS' || r.source === 'KS' || r.destination === 'TS' || r.destination === 'KS') && r.destination !== 'DS')} 
                type="Port" 
              />
            </div>

            {/* Row 4/5: Route Sections */}
            <div className="space-y-8">
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <h4 className="text-[11px] font-bold text-slate-800 uppercase tracking-widest">Master Automated Flows</h4>
                  <div className="h-px bg-slate-200 flex-1"></div>
                </div>
                <RouteCards records={filteredRecords} category={DataCategory.MASTER} />
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <h4 className="text-[11px] font-bold text-slate-800 uppercase tracking-widest">Transaction & Special Flows</h4>
                  <div className="h-px bg-slate-200 flex-1"></div>
                </div>
                <RouteCards records={filteredRecords} category={DataCategory.TRANSACTION} />
              </section>
            </div>

            {/* Row 6: Exception Grid */}
            <section className="pb-10">
              <h4 className="text-[11px] font-bold text-slate-800 uppercase tracking-widest mb-4">Live Sync Exception Log</h4>
              <div className="apex-region border border-slate-200 shadow-xl overflow-hidden rounded">
                <ExceptionGrid records={filteredRecords} onForceSync={handleForceSync} />
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
