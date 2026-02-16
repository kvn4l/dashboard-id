
import { SyncFlag, DataCategory, SyncRule, SyncRecord } from './types';

const generateMockRecords = (count: number): SyncRecord[] => {
  const categories = [DataCategory.MASTER, DataCategory.TRANSACTION];
  const rules = [SyncRule.SALES_RETURN, SyncRule.ALL_DATA];
  const flags = Object.values(SyncFlag);
  const sources = ['DM', 'TS', 'KS'];
  const destinations = ['DS', 'TS', 'KS', 'DM'];

  const records: SyncRecord[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const hoursAgo = Math.floor(Math.random() * 24);
    const timestamp = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000).toISOString();
    
    // Weighted flags to make it look realistic
    let flag = flags[Math.floor(Math.random() * flags.length)];
    if (Math.random() > 0.7) flag = SyncFlag.DUBAI_SUCCESS; // Most stuff is success

    const source = sources[Math.floor(Math.random() * sources.length)];
    let destination = destinations[Math.floor(Math.random() * destinations.length)];
    while (destination === source) {
      destination = destinations[Math.floor(Math.random() * destinations.length)];
    }

    records.push({
      id: `SYN-${1000 + i}`,
      source,
      destination,
      category: categories[Math.floor(Math.random() * categories.length)],
      rule: rules[Math.floor(Math.random() * rules.length)],
      flag: flag as SyncFlag,
      timestamp,
      lastModified: timestamp,
      description: `${categories[Math.floor(Math.random() * categories.length)]} Sync Operation`
    });
  }
  return records;
};

export const MOCK_RECORDS = generateMockRecords(120);
