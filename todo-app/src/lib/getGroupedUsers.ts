import { unstable_cache } from 'next/cache';

export type DepartmentSummary = {
  male: number;
  female: number;
  ageRange: string;
  hair: Record<string, number>;
  addressUser: Record<string, string>;
};

export type GroupedUsers = Record<string, DepartmentSummary>;

const baseUrl = process.env.USER_API_BASE_URL?.replace(/\/$/, '') ?? 'http://localhost:4000';

export const getGroupedUsers = unstable_cache(
  async (): Promise<GroupedUsers> => {
    const res = await fetch(`${baseUrl}/users/grouped`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error(`user-api returned ${res.status}`);
    }

    return res.json();
  },
  ['users-grouped'],
  { revalidate: 60, tags: ['users-grouped'] }
);
