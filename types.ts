
export enum SyncFlag {
  DUBAI_UNPROCESSED = 'TN',
  DUBAI_IN_TRANSIT = 'TS',
  DUBAI_SUCCESS = 'TY',
  PORT_UNPROCESSED = 'UN',
  PORT_IN_TRANSIT = 'US',
  PORT_SUCCESS = 'UY'
}

export enum DataCategory {
  MASTER = 'Master',
  TRANSACTION = 'Transaction'
}

export enum SyncRule {
  SALES_RETURN = 'SalesReturn',
  ALL_DATA = 'All'
}

export interface SyncRecord {
  id: string;
  source: string;
  destination: string;
  category: DataCategory;
  rule: SyncRule;
  flag: SyncFlag;
  timestamp: string;
  lastModified: string;
  description: string;
}
