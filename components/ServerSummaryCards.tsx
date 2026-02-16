
import React from 'react';
import { SyncRecord, SyncFlag } from '../types';
import { Server, Clock, Truck, CheckCircle2 } from 'lucide-react';

interface Props {
  records: SyncRecord[];
}

export const ServerSummaryCards: React.FC<Props> = ({ records }) => {
  const SERVERS = [
    { id: 'DM', name: 'Dubai Management (DM)' },
    { id: 'DS', name: 'Dubai Statutory (DS)' },
    { id: 'TS', name: 'Tanzania Port (TS)' },
    { id: 'KS', name: 'Kenya Port (KS)' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {SERVERS.map((srv) => {
        const outPending = records.filter(r => r.source === srv.id && [SyncFlag.DUBAI_UNPROCESSED, SyncFlag.PORT_UNPROCESSED].includes(r.flag)).length;
        const outTransit = records.filter(r => r.source === srv.id && [SyncFlag.DUBAI_IN_TRANSIT, SyncFlag.PORT_IN_TRANSIT].includes(r.flag)).length;
        const inTravelled = records.filter(r => r.destination === srv.id && [SyncFlag.DUBAI_SUCCESS, SyncFlag.PORT_SUCCESS].includes(r.flag)).length;

        return (
          <div key={srv.id} className="apex-region p-4 hover:shadow-md transition-all border-t-2 border-t-blue-600">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-blue-50 text-blue-600 rounded">
                <Server size={16} />
              </div>
              <h3 className="font-bold text-slate-800 text-xs truncate">{srv.name}</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center text-[11px]">
                <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                  <Clock size={12} className="text-red-400" /> Outbound Pending
                </span>
                <span className="font-bold text-slate-900">{outPending}</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                  <Truck size={12} className="text-yellow-500" /> In-Transit
                </span>
                <span className="font-bold text-slate-900">{outTransit}</span>
              </div>
              <div className="flex justify-between items-center text-[11px] pt-2 border-t border-slate-50">
                <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                  <CheckCircle2 size={12} className="text-green-500" /> Inbound Received
                </span>
                <span className="font-bold text-green-700">{inTravelled}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
