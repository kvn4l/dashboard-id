
import React from 'react';
import { SyncRecord, SyncFlag } from '../types';

interface Props {
  title: string;
  records: SyncRecord[];
  type: 'Dubai' | 'Port';
}

export const DataPipe: React.FC<Props> = ({ title, records, type }) => {
  const travelledFlag = type === 'Dubai' ? SyncFlag.DUBAI_SUCCESS : SyncFlag.PORT_SUCCESS;
  
  const total = records.length || 0;
  const travelledCount = records.filter(r => r.flag === travelledFlag).length;
  const yetCount = total - travelledCount;
  
  const travelledPct = total > 0 ? (travelledCount / total) * 100 : 0;
  const yetPct = total > 0 ? (yetCount / total) * 100 : 0;

  return (
    <div className="apex-region p-5">
      <h3 className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-tight border-b border-slate-100 pb-2">
        {title}
      </h3>
      
      <div className="flex h-10 w-full rounded overflow-hidden shadow-inner border border-slate-200">
        <div 
          style={{ width: `${travelledPct}%` }}
          className="bg-[#28a745] h-full transition-all duration-500 flex items-center justify-center text-white text-[10px] font-bold"
          title={`Travelled: ${travelledCount}`}
        >
          {travelledPct > 15 && `TRAVELLED (${travelledCount})`}
        </div>
        <div 
          style={{ width: `${yetPct}%` }}
          className="bg-[#dc3545] h-full transition-all duration-500 flex items-center justify-center text-white text-[10px] font-bold"
          title={`Yet to Travel: ${yetCount}`}
        >
          {yetPct > 15 && `YET TO TRAVEL (${yetCount})`}
        </div>
      </div>
      
      <div className="flex justify-between mt-3 text-[10px] font-bold uppercase tracking-wider">
        <div className="flex items-center gap-1.5 text-[#28a745]">
          <div className="w-2 h-2 bg-[#28a745] rounded-full"></div>
          {type === 'Dubai' ? 'TY Success' : 'UY Success'}
        </div>
        <div className="flex items-center gap-1.5 text-[#dc3545]">
          <div className="w-2 h-2 bg-[#dc3545] rounded-full"></div>
          {type === 'Dubai' ? 'TN/TS Pending' : 'UN/US Pending'}
        </div>
      </div>
    </div>
  );
};
