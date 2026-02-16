
import React from 'react';
import { SyncRecord, SyncFlag } from '../types';
import { COLORS } from '../constants';
import { AlertCircle, CheckCircle, Send, Radio } from 'lucide-react';

interface Props {
  records: SyncRecord[];
  activeNodes: number;
}

export const KpiCards: React.FC<Props> = ({ records, activeNodes }) => {
  const pendingDubai = records.filter(r => r.flag === SyncFlag.DUBAI_UNPROCESSED).length;
  const pendingPorts = records.filter(r => r.flag === SyncFlag.PORT_UNPROCESSED).length;
  const successCount = records.filter(r => r.flag === SyncFlag.DUBAI_SUCCESS || r.flag === SyncFlag.PORT_SUCCESS).length;
  const totalCount = records.length;
  const successRate = totalCount > 0 ? Math.round((successCount / totalCount) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
        <div className="flex justify-between items-start mb-2">
          <span className="text-slate-500 text-sm font-medium">Pending (Dubai)</span>
          <div className="p-2 bg-red-50 text-red-500 rounded-lg">
            <AlertCircle size={18} />
          </div>
        </div>
        <div className="text-2xl font-bold text-slate-900">{pendingDubai}</div>
        <div className="text-xs text-slate-400 mt-1">Records with 'TN' Flag</div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
        <div className="flex justify-between items-start mb-2">
          <span className="text-slate-500 text-sm font-medium">Pending (Ports)</span>
          <div className="p-2 bg-red-50 text-red-500 rounded-lg">
            <Send size={18} />
          </div>
        </div>
        <div className="text-2xl font-bold text-slate-900">{pendingPorts}</div>
        <div className="text-xs text-slate-400 mt-1">Records with 'UN' Flag</div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
        <div className="flex justify-between items-start mb-2">
          <span className="text-slate-500 text-sm font-medium">Success Rate</span>
          <div className="p-2 bg-green-50 text-green-500 rounded-lg">
            <CheckCircle size={18} />
          </div>
        </div>
        <div className="text-2xl font-bold text-slate-900">{successRate}%</div>
        <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
          <div 
            className="h-full bg-green-500 transition-all duration-1000" 
            style={{ width: `${successRate}%` }}
          />
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
        <div className="flex justify-between items-start mb-2">
          <span className="text-slate-500 text-sm font-medium">Server Health</span>
          <div className="p-2 bg-blue-50 text-blue-500 rounded-lg">
            <Radio size={18} />
          </div>
        </div>
        <div className="text-2xl font-bold text-slate-900">{activeNodes}/4</div>
        <div className="text-xs text-slate-400 mt-1">Active DB Links (DS, TS, KS)</div>
      </div>
    </div>
  );
};
