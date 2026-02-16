
import React, { useState, useEffect, useMemo } from 'react';
import { SyncRecord, SyncFlag, DataCategory, SyncRule } from './types';
import { MOCK_RECORDS } from './mockData';
import { SERVER_NODES } from './constants';
import { KpiCards } from './components/KpiCards';
import { DataPipe } from './components/DataPipe';
import { RouteCards } from './components/RouteCards';
import { ExceptionGrid } from './components/ExceptionGrid';
import { SqlReference } from './components/SqlReference';
import { analyzeSyncHealth } from './services/geminiService';
import { 
  Database, Search, RefreshCw, Menu, ChevronRight, BrainCircuit, Terminal, ChevronDown, Monitor, LayoutDashboard
} from 'lucide-react';

const App: React.FC = () => {
  const [records, setRecords] = useState<SyncRecord[]>(MOCK_RECORDS);
  const [categoryFilter, setCategoryFilter] = useState<DataCategory | 'All'>('All');
  const [ruleFilter, setRuleFilter] = useState<SyncRule | 'All'>('All');
  const [showSql, setShowSql] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [aiInsight, setAiInsight] = useState<{summary: string, recommendation: string} | null>(null);

  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      const matchCat = categoryFilter === 'All' || r.category === categoryFilter;
      const matchRule = ruleFilter === 'All' || r.rule === ruleFilter;
      return matchCat && matchRule;
    });
  }, [records, categoryFilter, ruleFilter]);

  const activeNodesCount = SERVER_NODES.filter(n => n.status === 'Active').length;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const handleForceSync = (id: string) => {
    setRecords(prev => prev.map(r => {
      if (r.id === id) {
        // Advanced sync logic: check current flag to decide next step
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
      {/* APEX Top Header */}
      <header className="h-12 bg-[#0066cc] flex items-center px-4 justify-between text-white shadow-md z-30">
        <div className="flex items-center gap-4">
          <Menu size={20} className="cursor-pointer" />
          <div className="flex items-center gap-2 font-bold text-sm tracking-tight">
            <Database size={18} />
            <span>ORACLE APEX</span>
            <span className="font-light opacity-30">|</span>
            <span className="text-blue-100">SyncMonitor Pro v3.0</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold">
          <span className="opacity-70">NODE: CLUSTER_01</span>
          <div className="w-6 h-6 rounded bg-blue-500 flex items-center justify-center border border-blue-400">A</div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Faceted Sidebar */}
        <aside className="w-64 bg-white border-r border-slate-200 overflow-y-auto hidden lg:block">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <Search size={14} /> Faceted Filters
          </div>
          <div className="p-4 space-y-6">
            <div>
              <h4 className="text-[11px] font-bold text-slate-800 uppercase mb-3 border-b border-slate-100 pb-1">Data Category</h4>
              <div className="space-y-2">
                {['All', DataCategory.MASTER, DataCategory.TRANSACTION].map((cat) => (
                  <label key={cat} className="flex items-center gap-2 cursor-pointer group">
                    <input type="radio" checked={categoryFilter === cat} onChange={() => setCategoryFilter(cat as any)} className="w-3 h-3 text-blue-600 focus:ring-blue-500" />
                    <span className={`text-sm ${categoryFilter === cat ? 'text-blue-600 font-bold' : 'text-slate-600 hover:text-blue-500'}`}>{cat === 'All' ? 'All (Master/Trans)' : cat}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-[11px] font-bold text-slate-800 uppercase mb-3 border-b border-slate-100 pb-1">Data Type</h4>
              <div className="space-y-2">
                {['All', SyncRule.SALES_RETURN].map((rule) => (
                  <label key={rule} className="flex items-center gap-2 cursor-pointer group">
                    <input type="radio" checked={ruleFilter === rule} onChange={() => setRuleFilter(rule as any)} className="w-3 h-3 text-blue-600 focus:ring-blue-500" />
                    <span className={`text-sm ${ruleFilter === rule ? 'text-blue-600 font-bold' : 'text-slate-600 hover:text-blue-500'}`}>{rule === 'All' ? 'All Types' : 'Sales & Return Only'}</span>
                  </label>
                ))}
              </div>
            </div>
            <button onClick={() => setShowSql(!showSql)} className="w-full mt-4 flex items-center justify-center gap-2 py-2 bg-slate-900 text-blue-400 text-[10px] font-bold rounded uppercase hover:bg-black transition-all">
              <Terminal size={14} /> {showSql ? 'Hide SQL Logic' : 'View SQL Source'}
            </button>
          </div>
        </aside>

        {/* Dashboard Canvas */}
        <div className="flex-1 overflow-y-auto bg-[#f2f2f2]">
          {/* Breadcrumb / Action Bar */}
          <div className="bg-white border-b border-slate-200 px-8 py-3 flex items-center justify-between sticky top-0 z-20">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
              <LayoutDashboard size={14} /> <span>Dashboard</span> <ChevronRight size={12} /> <span className="text-slate-900 font-bold">Monitor</span>
            </div>
            <button onClick={handleRefresh} className="bg-[#0066cc] text-white px-4 py-1.5 rounded text-xs font-bold flex items-center gap-2 hover:bg-blue-700 active:scale-95 transition-all shadow-sm">
              <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} /> REFRESH DASHBOARD
            </button>
          </div>

          <div className="p-8 max-w-7xl mx-auto space-y-6">
            {/* Story Text */}
            <div className="bg-white p-4 border border-slate-200 rounded text-xs text-slate-600 italic leading-relaxed shadow-sm">
              "Our dashboard treats each server as a node. We track the 'Travel' by monitoring the change in status flags. When a record is created in Dubai, it's 'TN'. Once it reaches 'TY', the travel is complete. This allows management to see exactly which regional port (Tanzania or Kenya) is lagging."
            </div>

            {/* Row 1: Global KPIs */}
            <KpiCards records={filteredRecords} activeNodes={activeNodesCount} />

            {/* AI Insights Alert */}
            {aiInsight && (
              <div className="bg-white border-l-4 border-blue-600 p-4 shadow-sm flex gap-4 animate-in fade-in slide-in-from-top-2 duration-500">
                <BrainCircuit size={24} className="text-blue-600 flex-shrink-0" />
                <div>
                  <h5 className="text-[10px] font-bold text-blue-900 uppercase tracking-widest">System Intelligence Advice</h5>
                  <p className="text-sm text-slate-700 mt-1 leading-relaxed">{aiInsight.summary}</p>
                  <p className="text-xs font-bold text-blue-600 mt-2">DBA Action: {aiInsight.recommendation}</p>
                </div>
              </div>
            )}

            {showSql && <SqlReference />}

            {/* Row 2: Aggregate Pipe Visuals */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DataPipe 
                title="Dubai Aggregate Pipe (DM ↔ DS / TS→DS / KS→DS)" 
                records={filteredRecords.filter(r => r.destination === 'DS')} 
                type="Dubai" 
              />
              <DataPipe 
                title="Port Aggregate Pipe (DM ↔ TS / DM ↔ KS / TS→DM / KS→DM)" 
                records={filteredRecords.filter(r => (r.source === 'TS' || r.source === 'KS' || r.destination === 'TS' || r.destination === 'KS') && r.destination !== 'DS')} 
                type="Port" 
              />
            </div>

            {/* Row 3: Route-wise Travel Status Cards */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-px bg-slate-200 flex-1"></div>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Route-wise Travel Status</h4>
                <div className="h-px bg-slate-200 flex-1"></div>
              </div>
              <RouteCards records={filteredRecords} />
            </div>

            {/* Row 4: Exception Grid (IG) */}
            <div className="apex-region">
              <div className="bg-slate-50 p-3 border-b border-slate-200 flex items-center gap-2 font-bold text-[10px] text-slate-500 uppercase tracking-wider">
                <Terminal size={14} className="text-blue-600" /> Interactive Grid: Sync Exception Report
              </div>
              <ExceptionGrid records={filteredRecords} onForceSync={handleForceSync} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
