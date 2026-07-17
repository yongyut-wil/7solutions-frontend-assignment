import { fetchUsers, type FetchUsersOptions } from './client.js';
import { groupByDepartment } from './transform.js';
import type { GroupedResult } from './types.js';

const CACHE_TTL_MS = 60_000;

interface CacheEntry {
  data: GroupedResult;
  expiresAt: number;
}

let cache: CacheEntry | null = null;
let pending: Promise<GroupedResult> | null = null;

export async function getGroupedUsers(options: FetchUsersOptions = {}): Promise<GroupedResult> {
  if (cache && cache.expiresAt > Date.now()) {
    return cache.data;
  }

  if (pending) {
    return pending;
  }

  pending = fetchUsers(options)
    .then((users) => {
      const data = groupByDepartment(users);
      cache = { data, expiresAt: Date.now() + CACHE_TTL_MS };
      return data;
    })
    .finally(() => {
      pending = null;
    });

  return pending;
}

export function clearGroupedUsersCache(): void {
  cache = null;
  pending = null;
}
