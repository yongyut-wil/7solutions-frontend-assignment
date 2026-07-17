import type { User } from './types.js';

const API_URL =
  'https://dummyjson.com/users?limit=0&select=gender,age,hair,address,company,firstName,lastName';

export interface FetchUsersOptions {
  signal?: AbortSignal;
  retries?: number;
}

interface FetchResponse {
  ok: boolean;
  status: number;
  statusText: string;
  json(): Promise<unknown>;
}

export async function fetchUsers(options: FetchUsersOptions = {}): Promise<User[]> {
  const { signal, retries = 1 } = options;
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = (await fetch(API_URL, { signal })) as FetchResponse;
      if (!res.ok) {
        throw new Error(`dummyjson returned ${res.status}: ${res.statusText}`);
      }
      const data = (await res.json()) as { users: User[] };
      return data.users;
    } catch (err) {
      lastError = err;
      if (attempt >= retries) break;
      await new Promise((resolve) => setTimeout(resolve, 250 * 2 ** attempt));
    }
  }

  throw lastError;
}
