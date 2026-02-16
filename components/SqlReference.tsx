
import React, { useState } from 'react';
import { Code, Copy, Terminal, Database, Link as LinkIcon } from 'lucide-react';

export const SqlReference: React.FC = () => {
  const [tab, setTab] = useState<'SQL' | 'PLSQL'>('SQL');

  return (
    <div className="apex-region mb-8 p-0 overflow-hidden shadow-md">
      <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Terminal size={18} className="text-blue-600" />
          <h3 className="font-bold text-slate-800 uppercase text-[10px] tracking-[0.2em]">Source Code Reference</h3>
        </div>
        <div className="flex gap-1 bg-slate-200 p-1 rounded">
          <button 
            onClick={() => setTab('SQL')}
            className={`px-3 py-1 text-[9px] font-bold rounded transition-all ${tab === 'SQL' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            DASHBOARD SQL
          </button>
          <button 
            onClick={() => setTab('PLSQL')}
            className={`px-3 py-1 text-[9px] font-bold rounded transition-all ${tab === 'PLSQL' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            CONNECTIVITY PL/SQL
          </button>
        </div>
      </div>

      <div className="bg-[#0f172a] p-5 font-mono">
        {tab === 'SQL' ? (
          <pre className="text-[11px] text-blue-300 leading-relaxed">
{`-- APEX Metric Source: Aggregate Totals
SELECT 
    'Dubai Status' as LABEL,
    COUNT(CASE WHEN FLAG = 'TN' THEN 1 END) as PENDING,
    COUNT(CASE WHEN FLAG = 'TY' THEN 1 END) as SUCCESS,
    ROUND(AVG(CASE WHEN FLAG = 'TY' THEN 100 ELSE 0 END), 2) as RATE
FROM SYNC_DATA_TABLE
WHERE (:P1_DATA_CATEGORY = 'All' OR CATEGORY = :P1_DATA_CATEGORY);

-- APEX Interactive Grid: Exception Filtering
SELECT ID, SOURCE, DEST, FLAG, TIMESTAMP,
       (SYSDATE - TIMESTAMP) * 24 as AGING_HOURS
FROM SYNC_DATA_TABLE
WHERE FLAG IN ('TN', 'UN')
ORDER BY AGING_HOURS DESC;`}
          </pre>
        ) : (
          <pre className="text-[11px] text-emerald-300 leading-relaxed">
{`-- PL/SQL Function: Real-time DB Link Ping
-- Use this in an APEX Dynamic Action or Background Process
FUNCTION verify_db_link(p_link_name IN VARCHAR2) RETURN NUMBER IS
    l_start   NUMBER;
    l_dummy   NUMBER;
BEGIN
    l_start := DBMS_UTILITY.GET_TIME;
    
    -- Attempt handshake with remote DUAL table
    EXECUTE IMMEDIATE 'SELECT 1 FROM DUAL@' || p_link_name INTO l_dummy;
    
    -- Return Latency in milliseconds
    RETURN (DBMS_UTILITY.GET_TIME - l_start) * 10;
EXCEPTION
    WHEN OTHERS THEN
        RETURN 0; -- Ping failed (Timeout/Network Error)
END;`}
          </pre>
        )}
      </div>
      
      <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[10px] text-slate-400">
          <Database size={12} /> Registered in APEX Application: 101 (Monitor)
        </div>
        <button className="flex items-center gap-1.5 text-[10px] font-bold text-blue-600 hover:text-blue-800 uppercase">
          <Copy size={12} /> Copy to Clipboard
        </button>
      </div>
    </div>
  );
};
