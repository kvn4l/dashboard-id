
import React, { useState, useEffect, useMemo } from 'react';
import { SyncRecord, SyncFlag, DataCategory, SyncRule } from './types';
import { MOCK_RECORDS } from './mockData';
import { SERVER_NODES } from './constants';
import { KpiCards } from './components/KpiCards';
import { DataPipe } from './components/DataPipe';
import { ExceptionGrid } from './components/ExceptionGrid';
import { SqlReference } from './components/SqlReference';
import { analyzeSyncHealth } from './services/geminiService';
import { 
  LayoutDashboard, 
  Database, 
  Search, 
  RefreshCw, 
  Menu,
  ChevronRight,
  BrainCircuit,
  Terminal,
  ChevronDown,
  Monitor
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
        const newFlag = r.flag === SyncFlag.DUBAI_UNPROCESSED ? SyncFlag.DUBAI_IN_TRANSIT : SyncFlag.PORT_IN_TRANSIT;
        return { ...r, flag: newFlag as SyncFlag, lastModified: new Date().toISOString() };
      }
      return r;
    }));
  };

  useEffect(() => {
    const fetchAiInsights = async () => {
      const insight = await analyzeSyncHealth(records);
      setAiInsight(insight);
    };
    fetchAiInsights();
  }, [records.length]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Header - APEX Nav Bar */}
      <header className="h-12 bg-[#0066cc] flex items-center px-4 justify-between text-white shadow-md z-30">
        <div className="flex items-center gap-4">
          <Menu size={20} className="cursor-pointer" />
          <div className="flex items-center gap-2 font-bold text-sm">
            <Database size={18} />
            <span>ORACLE APEX</span>
            <span className="font-light opacity-50 px-2">|</span>
            <span>SyncMonitor Pro v2.5</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2 opacity-80 cursor-pointer hover:opacity-100">
            <div className="w-6 h-6 rounded-full bg-blue-500 border border-blue-400 flex items-center justify-center font-bold">A</div>
            <span>ADMIN_USER</span>
            <ChevronDown size={14} />
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Side Navigation / Faceted Search */}
        <aside className="w-64 bg-white border-r border-slate-200 overflow-y-auto hidden lg:block">
          <div className="p-4 border-b border-slate-100 bg-slate-50">
            <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-widest">
              <Search size={14} />
              Faceted Search
            </div>
          </div>
          
          <div className="p-4 space-y-6">
            <div>
              <h4 className="text-[11px] font-bold text-slate-400 uppercase mb-3">Data Category</h4>
              <div className="space-y-2">
                {['All', DataCategory.MASTER, DataCategory.TRANSACTION].map((cat) => (
                  <label key={cat} className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="cat" 
                      checked={categoryFilter === cat} 
                      onChange={() => setCategoryFilter(cat as any)}
                      className="w-3 h-3 text-blue-600 border-slate-300 focus:ring-blue-500" 
                    />
                    <span className={`text-sm ${categoryFilter === cat ? 'text-blue-600 font-semibold' : 'text-slate-600'}`}>{cat === 'All' ? 'All Data' : cat}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-[11px] font-bold text-slate-400 uppercase mb-3">Sync Logic</h4>
              <div className="space-y-2">
                {['All', SyncRule.SALES_RETURN, SyncRule.ALL_DATA].map((rule) => (
                  <label key={rule} className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="rule" 
                      checked={ruleFilter === rule} 
                      onChange={() => setRuleFilter(rule as any)}
                      className="w-3 h-3 text-blue-600 border-slate-300 focus:ring-blue-500" 
                    />
                    <span className={`text-sm ${ruleFilter === rule ? 'text-blue-600 font-semibold' : 'text-slate-600'}`}>{rule === 'All' ? 'Full Scope' : rule}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button 
                onClick={() => setShowSql(!showSql)}
                className="w-full flex items-center justify-between p-2 rounded bg-slate-100 text-slate-600 text-xs font-bold hover:bg-slate-200 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Terminal size={14} />
                  {showSql ? 'Hide SQL Logic' : 'View APEX SQL'}
                </div>
                <ChevronRight size={14} className={showSql ? 'rotate-90' : ''} />
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto bg-[#f9fafb]">
          {/* Breadcrumbs */}
          <div className="bg-white border-b border-slate-200 px-8 py-3 flex items-center justify-between sticky top-0 z-20 shadow-sm">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
              <LayoutDashboard size={14} />
              <span>Dashboard</span>
              <ChevronRight size={12} />
              <span className="text-slate-900 font-bold">Sync Monitor</span>
            </div>
            
            <div className="flex gap-2">
               <button 
                onClick={handleRefresh}
                className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-300 rounded text-xs font-bold text-slate-700 hover:bg-slate-50 active:shadow-inner"
              >
                <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
                Refresh Page
              </button>
            </div>
          </div>

          <div className="p-8 max-w-7xl mx-auto">
            {/* APEX Region: Metrics */}
            <div className="mb-8">
              <KpiCards records={filteredRecords} activeNodes={activeNodesCount} />
            </div>

            {showSql && <SqlReference />}

            {/* AI Insight (APEX Style Alert) */}
            {aiInsight && (
              <div className="mb-8 bg-blue-50 border-l-4 border-blue-600 p-4 shadow-sm flex gap-4">
                <BrainCircuit size={24} className="text-blue-600 flex-shrink-0" />
                <div>
                  <h5 className="text-xs font-bold text-blue-900 uppercase mb-1">Infrastructure Health Insight</h5>
                  <p className="text-sm text-blue-800 leading-relaxed mb-2">{aiInsight.summary}</p>
                  <div className="text-xs font-bold text-blue-600">Action Plan: {aiInsight.recommendation}</div>
                </div>
              </div>
            )}

            {/* Data Pipeline Regions */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
              <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <DataPipe 
                  title="Dubai Main Sync (DM)" 
                  source="DM" 
                  destination="DS" 
                  records={filteredRecords}
                  type="Dubai"
                />
                <DataPipe 
                  title="Tanzania Link (TS)" 
                  source="DM" 
                  destination="TS" 
                  records={filteredRecords}
                  type="Port"
                />
              </div>
              
              <div className="apex-region p-6 flex flex-col justify-center">
                <div className="text-center">
                  <Monitor size={48} className="mx-auto text-slate-300 mb-4" />
                  <h4 className="font-bold text-slate-800 mb-2">DB Link Heartbeat</h4>
                  <div className="space-y-3">
                    {SERVER_NODES.map(node => (
                      <div key={node.id} className="flex items-center justify-between text-xs p-2 bg-slate-50 rounded border border-slate-100">
                        <span className="font-bold text-slate-600">{node.name}</span>
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${node.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {node.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Grid Region */}
            <div className="apex-region">
              <div className="bg-slate-50 p-3 border-b border-slate-200 flex justify-between items-center">
                <div className="flex items-center gap-2 font-bold text-xs text-slate-700 uppercase">
                  <Terminal size={14} className="text-blue-600" />
                  Sync Exception Report (Interactive Grid)
                </div>
                <div className="flex gap-1">
                  <div className="h-5 w-5 bg-white border border-slate-200 flex items-center justify-center rounded shadow-sm text-slate-400 cursor-pointer">
                    <ChevronRight size={12} className="rotate-180" />
                  </div>
                  <div className="h-5 w-5 bg-white border border-slate-200 flex items-center justify-center rounded shadow-sm text-slate-400 cursor-pointer">
                    <ChevronRight size={12} />
                  </div>
                </div>
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
