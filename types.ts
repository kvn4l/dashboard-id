
export enum SyncFlag {
  DUBAI_UNPROCESSED = 'TN',
  DUBAI_IN_TRANSIT = 'TS',
  DUBAI_SUCCESS = 'TY',
  PORT_UNPROCESSED = 'UN',
  PORT_IN_TRANSIT = 'US',
  PORT_SUCCESS = 'UY'
}

export enum DataCategory {
  MASTER = 'Master Data',
  TRANSACTION = 'Transaction Data'
}

export enum SyncRule {
  SALES_RETURN = 'Sales & Return Only',
  ALL_DATA = 'All Data'
}

export interface ServerNode {
  id: string;
  name: string;
  ip: string;
  status: 'Active' | 'Inactive';
  type: 'Dubai' | 'Port';
}

export interface SyncRecord {
  id: string;
  source: string;
  destination: string;
  category: DataCategory;
  rule: SyncRule;
  flag: SyncFlag;
  timestamp: string; // ISO String
  lastModified: string; // ISO String
  description: string;
}

export interface DashboardMetrics {
  totalPendingDubai: number;
  totalPendingPorts: number;
  successRate: number;
  activeLinks: number;
}
