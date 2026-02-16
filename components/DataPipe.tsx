
import React from 'react';
import { SyncRecord, SyncFlag } from '../types';
import { ArrowRight, Server } from 'lucide-react';

interface Props {
  title: string;
  source: string;
  destination: string;
  records: SyncRecord[];
  type: 'Dubai' | 'Port';
}

export const DataPipe: React.FC<Props> = ({ title, source, destination, records, type }) => {
  const relevant = records.filter(r => r.source === source && r.destination === destination);
  
  const successFlag = type === 'Dubai' ? SyncFlag.DUBAI_SUCCESS : SyncFlag.PORT_SUCCESS;
  const pendingFlag = type === 'Dubai' ? SyncFlag.DUBAI_UNPROCESSED : SyncFlag.PORT_UNPROCESSED;
  const transitFlag = type === 'Dubai' ? SyncFlag.DUBAI_IN_TRANSIT : SyncFlag.PORT_IN_TRANSIT;

  const travelled = relevant.filter(r => r.flag === successFlag).length;
  const pending = relevant.filter(r => r.flag === pendingFlag).length;
  const transit = relevant.filter(r => r.flag === transitFlag).length;
  const total = relevant.length || 1; // avoid div by zero

  const travelledPct = (travelled / total) * 100;
  const transitPct = (transit / total) * 100;
  const pendingPct = (pending / total) * 100;

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
          <Server size={18} className="text-blue-600" />
          {title}
        </h3>
        <span className="text-xs font-bold px-2 py-1 bg-slate-100 text-slate-500 rounded uppercase">
          {source} &rarr; {destination}
        </span>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="flex-1">
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span>Flow Progress</span>
            <span>{Math.round(travelledPct)}% Completed</span>
          </div>
          <div className="h-6 w-full flex rounded-lg overflow-hidden border border-slate-100 bg-slate-50">
            <div 
              style={{ width: `${travelledPct}%` }} 
              className="bg-green-500 h-full transition-all flex items-center justify-center text-[10px] text-white font-bold"
              title="Travelled (TY/UY)"
            >
              {travelled > 0 && `${travelled}`}
            </div>
            <div 
              style={{ width: `${transitPct}%` }} 
              className="bg-yellow-400 h-full transition-all flex items-center justify-center text-[10px] text-white font-bold"
              title="In-Transit (TS/US)"
            >
              {transit > 0 && `${transit}`}
            </div>
            <div 
              style={{ width: `${pendingPct}%` }} 
              className="bg-red-500 h-full transition-all flex items-center justify-center text-[10px] text-white font-bold"
              title="Yet to Travel (TN/UN)"
            >
              {pending > 0 && `${pending}`}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="text-center p-2 rounded-lg bg-green-50 border border-green-100">
          <div className="text-[10px] text-green-600 font-bold uppercase">Travelled</div>
          <div className="text-lg font-bold text-green-700">{travelled}</div>
        </div>
        <div className="text-center p-2 rounded-lg bg-yellow-50 border border-yellow-100">
          <div className="text-[10px] text-yellow-600 font-bold uppercase">In-Transit</div>
          <div className="text-lg font-bold text-yellow-700">{transit}</div>
        </div>
        <div className="text-center p-2 rounded-lg bg-red-50 border border-red-100">
          <div className="text-[10px] text-red-600 font-bold uppercase">Unprocessed</div>
          <div className="text-lg font-bold text-red-700">{pending}</div>
        </div>
      </div>
    </div>
  );
};
