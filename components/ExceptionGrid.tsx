
import React from 'react';
import { SyncRecord, SyncFlag } from '../types';
import { Clock, RefreshCcw, CheckCircle, AlertTriangle } from 'lucide-react';

interface Props {
  records: SyncRecord[];
  onForceSync: (id: string) => void;
}

export const ExceptionGrid: React.FC<Props> = ({ records, onForceSync }) => {
  const exceptions = records.filter(r => 
    [SyncFlag.DUBAI_UNPROCESSED, SyncFlag.PORT_UNPROCESSED].includes(r.flag)
  ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const getAging = (timestamp: string) => {
    return (new Date().getTime() - new Date(timestamp).getTime()) / (1000 * 60 * 60);
  };

  const getServerStuck = (r: SyncRecord) => {
    if (r.source === 'TS' || r.destination === 'TS') return 'Tanzania';
    if (r.source === 'KS' || r.destination === 'KS') return 'Kenya';
    return 'Dubai';
  };

  return (
    <div className="bg-white overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead className="bg-[#f0f0f0] border-b border-slate-300 text-slate-700 uppercase text-[10px] font-bold">
            <tr>
              <th className="px-4 py-2 border-r border-slate-200">ID</th>
              <th className="px-4 py-2 border-r border-slate-200">Server Stuck</th>
              <th className="px-4 py-2 border-r border-slate-200">Flag</th>
              <th className="px-4 py-2 border-r border-slate-200">Aging Alert</th>
              <th className="px-4 py-2 border-r border-slate-200">Route</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {exceptions.map((record) => {
              const aging = getAging(record.timestamp);
              const isCritical = aging > 4;

              return (
                <tr key={record.id} className={`hover:bg-blue-50/40 transition-colors ${isCritical ? 'bg-red-50' : ''}`}>
                  <td className="px-4 py-3 font-mono font-medium text-slate-700 border-r border-slate-100">{record.id}</td>
                  <td className="px-4 py-3 border-r border-slate-100 font-bold text-slate-600">
                    {getServerStuck(record)}
                  </td>
                  <td className="px-4 py-3 border-r border-slate-100">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${isCritical ? 'bg-red-100 text-red-700 border-red-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                      {record.flag}
                    </span>
                  </td>
                  <td className="px-4 py-3 border-r border-slate-100">
                    <div className="flex items-center gap-2">
                      {isCritical ? (
                        <span className="flex items-center gap-1 text-red-600 font-bold text-[10px] uppercase">
                          <AlertTriangle size={12} /> Critical (&gt;4h)
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[10px] uppercase font-medium">Under Limit</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 border-r border-slate-100 text-xs text-slate-500">
                    {record.source} &rarr; {record.destination}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button 
                      onClick={() => onForceSync(record.id)}
                      className="inline-flex items-center gap-1 bg-white border border-slate-300 px-2 py-1 rounded shadow-sm text-blue-600 hover:bg-blue-600 hover:text-white transition-all font-bold text-[10px] uppercase"
                    >
                      <RefreshCcw size={12} /> Force Sync
                    </button>
                  </td>
                </tr>
              );
            })}
            {exceptions.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-20 text-center">
                  <CheckCircle className="text-green-500 mx-auto mb-2" size={32} />
                  <p className="font-bold text-slate-400 uppercase tracking-widest text-xs">No Records Stuck in Transit</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="bg-[#f0f0f0] border-t border-slate-300 p-2 flex justify-between items-center text-[10px] font-bold text-slate-500">
        <div>Filtered Exceptions: {exceptions.length}</div>
        <div className="flex gap-2">Pagination: 1-10 of {exceptions.length}</div>
      </div>
    </div>
  );
};
