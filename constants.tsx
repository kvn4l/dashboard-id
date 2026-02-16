
import React from 'react';
import { Server, Activity, ArrowRightLeft, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const COLORS = {
  SUCCESS: '#22c55e', // Green
  TRANSIT: '#eab308', // Yellow
  PENDING: '#ef4444', // Red
  PRIMARY: '#0f172a', // Dark Slate
  SECONDARY: '#64748b' // Slate
};

export const SERVER_NODES = [
  { id: 'DM', name: 'Dubai Main (DM)', ip: '192.168.1.10', status: 'Active', type: 'Dubai' },
  { id: 'DS', name: 'Dubai Secondary (DS)', ip: '192.168.1.11', status: 'Active', type: 'Dubai' },
  { id: 'TS', name: 'Tanzania Port (TS)', ip: '192.168.2.50', status: 'Active', type: 'Port' },
  { id: 'KS', name: 'Kenya Port (KS)', ip: '192.168.3.50', status: 'Inactive', type: 'Port' },
];

export const ICON_MAP = {
  Server: <Server size={20} />,
  Activity: <Activity size={20} />,
  Sync: <ArrowRightLeft size={20} />,
  Alert: <AlertTriangle size={20} />,
  Check: <CheckCircle2 size={20} />
};
