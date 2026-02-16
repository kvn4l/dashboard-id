
import React from 'react';
import { SyncRecord, SyncFlag, DataCategory, SyncRule } from '../types';
import { ArrowRight } from 'lucide-react';

interface RouteDefinition {
  label: string;
  source: string;
  dest: string;
  successFlag: SyncFlag;
  pendingFlags: SyncFlag[];
  reqCategory?: DataCategory;
  reqRule?: SyncRule;
}

const ROUTE_CONFIGS: RouteDefinition[] = [
  { label: 'DM → DS', source: 'DM', dest: 'DS', successFlag: SyncFlag.DUBAI_SUCCESS, pendingFlags: [SyncFlag.DUBAI_UNPROCESSED, SyncFlag.DUBAI_IN_TRANSIT] },
  { label: 'DM → TS', source: 'DM', dest: 'TS', successFlag: SyncFlag.PORT_SUCCESS, pendingFlags: [SyncFlag.PORT_UNPROCESSED, SyncFlag.PORT_IN_TRANSIT] },
  { label: 'DM → KS', source: 'DM', dest: 'KS', successFlag: SyncFlag.PORT_SUCCESS, pendingFlags: [SyncFlag.PORT_UNPROCESSED, SyncFlag.PORT_IN_TRANSIT] },
  { label: 'TS → DS', source: 'TS', dest: 'DS', successFlag: SyncFlag.DUBAI_SUCCESS, pendingFlags: [SyncFlag.DUBAI_UNPROCESSED, SyncFlag.DUBAI_IN_TRANSIT] },
  { label: 'TS → DM', source: 'TS', dest: 'DM', successFlag: SyncFlag.PORT_SUCCESS, pendingFlags: [SyncFlag.PORT_UNPROCESSED, SyncFlag.PORT_IN_TRANSIT], reqCategory: DataCategory.TRANSACTION, reqRule: SyncRule.SALES_RETURN },
  { label: 'KS → DS', source: 'KS', dest: 'DS', successFlag: SyncFlag.DUBAI_SUCCESS, pendingFlags: [SyncFlag.DUBAI_UNPROCESSED, SyncFlag.DUBAI_IN_TRANSIT] },
  { label: 'KS → DM', source: 'KS', dest: 'DM', successFlag: SyncFlag.PORT_SUCCESS, pendingFlags: [SyncFlag.PORT_UNPROCESSED, SyncFlag.PORT_IN_TRANSIT], reqCategory: DataCategory.TRANSACTION, reqRule: SyncRule.SALES_RETURN },
];

interface Props {
  records: SyncRecord[];
}

export const RouteCards: React.FC<Props> = ({ records }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {ROUTE_CONFIGS.map((config) => {
        // Filter records belonging to this specific route
        const routeRecords = records.filter(r => 
          r.source === config.source && 
          r.dest === config.dest &&
          (!config.reqCategory || r.category === config.reqCategory) &&
          (!config.reqRule || r.rule === config.reqRule)
        );

        const travelled = routeRecords.filter(r => r.flag === config.successFlag).length;
        const pending = routeRecords.filter(r => config.pendingFlags.includes(r.flag)).length;
        const total = travelled + pending;
        const pct = total > 0 ? (travelled / total) * 100 : 0;

        return (
          <div key={config.label} className="apex-region p-4 flex flex-col justify-between hover:border-blue-300 transition-colors group">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                  {config.source} <ArrowRight size={12} className="text-slate-400" /> {config.dest}
                </span>
                {config.reqRule === SyncRule.SALES_RETURN && (
                  <span className="text-[8px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded border border-blue-100 font-bold uppercase">Sales Only</span>
                )}
              </div>
              
              <div className="flex justify-between items-end mb-1">
                <div className="text-[10px] text-slate-500 font-bold uppercase">Success: <span className="text-slate-900">{travelled}</span></div>
                <div className="text-[10px] text-slate-500 font-bold uppercase">Pending: <span className="text-red-600">{pending}</span></div>
              </div>
            </div>

            <div className="mt-2">
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                <div 
                  className="h-full bg-[#28a745] transition-all duration-700" 
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="text-[9px] text-right mt-1 font-bold text-slate-400 group-hover:text-blue-500 transition-colors">
                {Math.round(pct)}% COMPLETE
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
