
import React from 'react';
import { SyncRecord, SyncFlag } from '../types';
import { Clock, RefreshCcw, ExternalLink, CheckCircle, AlertTriangle } from 'lucide-react';

interface Props {
  records: SyncRecord[];
  onForceSync: (id: string) => void;
}

export const ExceptionGrid: React.FC<Props> = ({ records, onForceSync }) => {
  const exceptions = records.filter(r => 
    [SyncFlag.DUBAI_UNPROCESSED, SyncFlag.PORT_UNPROCESSED].includes(r.flag)
  ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const getAging = (timestamp: string) => {
    const hours = (new Date().getTime() - new Date(timestamp).getTime()) / (1000 * 60 * 60);
    return hours;
  };

  return (
    <div className="bg-white overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead className="bg-[#f0f0f0] border-b border-slate-300 text-slate-700 uppercase text-[10px] font-bold">
            <tr>
              <th className="px-4 py-2 border-r border-slate-200">ID</th>
              <th className="px-4 py-2 border-r border-slate-200">Source Node</th>
              <th className="px-4 py-2 border-r border-slate-200">Flag</th>
              <th className="px-4 py-2 border-r border-slate-200 text-center">Severity</th>
              <th className="px-4 py-2 border-r border-slate-200">Aging</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {exceptions.map((record) => {
              const aging = getAging(record.timestamp);
              const isCritical = aging > 4;

              return (
                <tr key={record.id} className={`hover:bg-blue-50/30 transition-colors group ${isCritical ? 'bg-red-50/20' : ''}`}>
                  <td className="px-4 py-3 font-mono font-medium text-slate-700 border-r border-slate-100">{record.id}</td>
                  <td className="px-4 py-3 border-r border-slate-100">
                    <span className="font-semibold text-slate-800">{record.source}</span>
                  </td>
                  <td className="px-4 py-3 border-r border-slate-100">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold border border-slate-200">
                      {record.flag}
                    </span>
                  </td>
                  <td className="px-4 py-3 border-r border-slate-100 text-center">
                    {isCritical ? (
                      <div className="flex justify-center" title="Aging Critical > 4h">
                        <AlertTriangle size={14} className="text-red-500" />
                      </div>
                    ) : (
                      <div className="flex justify-center" title="Warning status">
                        <Clock size={14} className="text-yellow-500" />
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 border-r border-slate-100">
                    <span className={`font-medium text-xs ${isCritical ? 'text-red-600 font-bold' : 'text-slate-500'}`}>
                      {Math.floor(aging)}h {Math.round((aging % 1) * 60)}m
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button 
                      onClick={() => onForceSync(record.id)}
                      className="inline-flex items-center gap-1 bg-white border border-slate-200 px-2 py-1 rounded shadow-sm text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all font-bold text-[10px] uppercase"
                    >
                      <RefreshCcw size={12} />
                      Sync
                    </button>
                  </td>
                </tr>
              );
            })}
            {exceptions.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center text-slate-400">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
                      <CheckCircle className="text-green-500" size={24} />
                    </div>
                    <p className="font-bold text-slate-500 uppercase tracking-widest text-xs">No Pending Sync Actions</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="bg-[#f0f0f0] border-t border-slate-300 p-2 flex justify-between items-center text-[10px] font-bold text-slate-500">
        <div>Showing 1 - {exceptions.length} of {exceptions.length}</div>
        <div className="flex gap-2 items-center">
          Rows Per Page: 
          <select className="bg-white border border-slate-300 rounded px-1">
            <option>10</option>
            <option>50</option>
            <option>All</option>
          </select>
        </div>
      </div>
    </div>
  );
};
