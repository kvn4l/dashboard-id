
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

const ALL_ROUTE_CONFIGS: RouteDefinition[] = [
  // Master Routes
  { label: 'DM → DS', source: 'DM', dest: 'DS', successFlag: SyncFlag.DUBAI_SUCCESS, pendingFlags: [SyncFlag.DUBAI_UNPROCESSED, SyncFlag.DUBAI_IN_TRANSIT], reqCategory: DataCategory.MASTER },
  { label: 'DM → TS', source: 'DM', dest: 'TS', successFlag: SyncFlag.PORT_SUCCESS, pendingFlags: [SyncFlag.PORT_UNPROCESSED, SyncFlag.PORT_IN_TRANSIT], reqCategory: DataCategory.MASTER },
  { label: 'DM → KS', source: 'DM', dest: 'KS', successFlag: SyncFlag.PORT_SUCCESS, pendingFlags: [SyncFlag.PORT_UNPROCESSED, SyncFlag.PORT_IN_TRANSIT], reqCategory: DataCategory.MASTER },
  { label: 'TS → DS', source: 'TS', dest: 'DS', successFlag: SyncFlag.DUBAI_SUCCESS, pendingFlags: [SyncFlag.DUBAI_UNPROCESSED, SyncFlag.DUBAI_IN_TRANSIT], reqCategory: DataCategory.MASTER },
  { label: 'KS → DS', source: 'KS', dest: 'DS', successFlag: SyncFlag.DUBAI_SUCCESS, pendingFlags: [SyncFlag.DUBAI_UNPROCESSED, SyncFlag.DUBAI_IN_TRANSIT], reqCategory: DataCategory.MASTER },
  
  // Transaction Routes
  { label: 'DM → DS', source: 'DM', dest: 'DS', successFlag: SyncFlag.DUBAI_SUCCESS, pendingFlags: [SyncFlag.DUBAI_UNPROCESSED, SyncFlag.DUBAI_IN_TRANSIT], reqCategory: DataCategory.TRANSACTION },
  { label: 'DM → TS', source: 'DM', dest: 'TS', successFlag: SyncFlag.PORT_SUCCESS, pendingFlags: [SyncFlag.PORT_UNPROCESSED, SyncFlag.PORT_IN_TRANSIT], reqCategory: DataCategory.TRANSACTION },
  { label: 'DM → KS', source: 'DM', dest: 'KS', successFlag: SyncFlag.PORT_SUCCESS, pendingFlags: [SyncFlag.PORT_UNPROCESSED, SyncFlag.PORT_IN_TRANSIT], reqCategory: DataCategory.TRANSACTION },
  { label: 'TS → DM', source: 'TS', dest: 'DM', successFlag: SyncFlag.PORT_SUCCESS, pendingFlags: [SyncFlag.PORT_UNPROCESSED, SyncFlag.PORT_IN_TRANSIT], reqCategory: DataCategory.TRANSACTION, reqRule: SyncRule.SALES_RETURN },
  { label: 'KS → DM', source: 'KS', dest: 'DM', successFlag: SyncFlag.PORT_SUCCESS, pendingFlags: [SyncFlag.PORT_UNPROCESSED, SyncFlag.PORT_IN_TRANSIT], reqCategory: DataCategory.TRANSACTION, reqRule: SyncRule.SALES_RETURN },
];

interface Props {
  records: SyncRecord[];
  category?: DataCategory;
}

export const RouteCards: React.FC<Props> = ({ records, category }) => {
  const configs = category 
    ? ALL_ROUTE_CONFIGS.filter(c => c.reqCategory === category)
    : ALL_ROUTE_CONFIGS;

  if (configs.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3">
      {configs.map((config, idx) => {
        const routeRecords = records.filter(r => 
          r.source === config.source && 
          r.dest === config.dest &&
          r.category === config.reqCategory &&
          (!config.reqRule || r.rule === config.reqRule)
        );

        const travelled = routeRecords.filter(r => r.flag === config.successFlag).length;
        const pending = routeRecords.filter(r => config.pendingFlags.includes(r.flag)).length;
        const total = travelled + pending;
        const pct = total > 0 ? (travelled / total) * 100 : 0;

        return (
          <div key={`${config.label}-${idx}`} className="apex-region p-3 bg-white hover:bg-slate-50 transition-colors border-l-4 border-l-slate-200 hover:border-l-blue-500">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                {config.source} <ArrowRight size={10} className="text-slate-300" /> {config.dest}
              </span>
              {config.reqRule === SyncRule.SALES_RETURN && (
                <span className="text-[7px] bg-amber-50 text-amber-600 px-1 py-0.5 rounded border border-amber-100 font-bold uppercase">S&R</span>
              )}
            </div>
            
            <div className="flex justify-between items-center text-[10px] mb-1.5">
              <span className="text-slate-400 font-bold">OK: <span className="text-slate-900">{travelled}</span></span>
              <span className="text-slate-400 font-bold">PEND: <span className="text-red-500">{pending}</span></span>
            </div>

            <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 transition-all duration-700" 
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
