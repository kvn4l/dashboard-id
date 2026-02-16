
import { SyncFlag, DataCategory, SyncRule, SyncRecord } from './types';

const ROUTES = [
  { s: 'DM', d: 'DS', c: DataCategory.MASTER, r: SyncRule.ALL_DATA, f: 'DUBAI' },
  { s: 'DM', d: 'DS', c: DataCategory.TRANSACTION, r: SyncRule.ALL_DATA, f: 'DUBAI' },
  { s: 'DM', d: 'TS', c: DataCategory.MASTER, r: SyncRule.ALL_DATA, f: 'PORT' },
  { s: 'DM', d: 'TS', c: DataCategory.TRANSACTION, r: SyncRule.ALL_DATA, f: 'PORT' },
  { s: 'TS', d: 'DS', c: DataCategory.MASTER, r: SyncRule.ALL_DATA, f: 'DUBAI' },
  { s: 'TS', d: 'DM', c: DataCategory.TRANSACTION, r: SyncRule.SALES_RETURN, f: 'PORT' },
  { s: 'DM', d: 'KS', c: DataCategory.MASTER, r: SyncRule.ALL_DATA, f: 'PORT' },
  { s: 'DM', d: 'KS', c: DataCategory.TRANSACTION, r: SyncRule.ALL_DATA, f: 'PORT' },
  { s: 'KS', d: 'DS', c: DataCategory.MASTER, r: SyncRule.ALL_DATA, f: 'DUBAI' },
  { s: 'KS', d: 'DM', c: DataCategory.TRANSACTION, r: SyncRule.SALES_RETURN, f: 'PORT' },
];

export const generateMockRecords = (count: number): SyncRecord[] => {
  const records: SyncRecord[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const route = ROUTES[Math.floor(Math.random() * ROUTES.length)];
    const hoursAgo = Math.random() * 12; // Some fresh, some old (>4h)
    const timestamp = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000).toISOString();
    
    // Weight success heavily for a healthy looking dashboard
    let flag: SyncFlag;
    const rand = Math.random();
    if (route.f === 'DUBAI') {
      flag = rand > 0.4 ? SyncFlag.DUBAI_SUCCESS : (rand > 0.2 ? SyncFlag.DUBAI_IN_TRANSIT : SyncFlag.DUBAI_UNPROCESSED);
    } else {
      flag = rand > 0.4 ? SyncFlag.PORT_SUCCESS : (rand > 0.2 ? SyncFlag.PORT_IN_TRANSIT : SyncFlag.PORT_UNPROCESSED);
    }

    records.push({
      id: `${10000 + i}`,
      source: route.s,
      destination: route.d,
      category: route.c,
      rule: route.r,
      flag,
      timestamp,
      lastModified: timestamp,
      description: `${route.c} Sync: ${route.s} to ${route.d}`
    });
  }
  return records;
};

export const MOCK_RECORDS = generateMockRecords(150);
