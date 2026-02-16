
import React from 'react';
import { Code, Copy } from 'lucide-react';

export const SqlReference: React.FC = () => {
  return (
    <div className="apex-region mb-6 p-4">
      <div className="flex items-center gap-2 mb-3 border-b border-slate-100 pb-2">
        <Code size={18} className="text-blue-600" />
        <h3 className="font-semibold text-slate-800 uppercase text-xs tracking-wider">APEX SQL Reference (Source Query)</h3>
      </div>
      <div className="bg-slate-900 rounded p-4 overflow-x-auto">
        <pre className="text-[11px] text-blue-300 leading-relaxed font-mono">
{`-- APEX Chart / Metric Source Logic
SELECT 
    COUNT(CASE WHEN FLAG = 'TN' THEN 1 END) as PENDING_DUBAI,
    COUNT(CASE WHEN FLAG = 'UN' THEN 1 END) as PENDING_PORTS,
    ROUND(COUNT(CASE WHEN FLAG IN ('TY', 'UY') THEN 1 END) / COUNT(*) * 100) as SUCCESS_RATE,
    -- APEX Status Badge Logic
    CASE 
        WHEN SYSDATE - TIMESTAMP > 4/24 AND FLAG IN ('TN', 'UN') THEN 'u-danger'
        WHEN FLAG IN ('TS', 'US') THEN 'u-warning'
        ELSE 'u-success'
    END as STATUS_CSS
FROM SYNC_LOG_TABLE
WHERE (:P1_CATEGORY = 'All' OR CATEGORY = :P1_CATEGORY)`}
        </pre>
      </div>
      <p className="text-[10px] text-slate-400 mt-2">Use this SQL in APEX Chart Regions or Classic Reports with HTML Expressions.</p>
    </div>
  );
};
