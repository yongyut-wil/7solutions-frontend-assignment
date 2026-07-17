'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { DepartmentCard } from '@/components/DepartmentCard';
import type { GroupedUsers } from '@/lib/getGroupedUsers';

export default function DepartmentsPage() {
  const [data, setData] = useState<GroupedUsers | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch('/api/users/grouped')
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error ?? `HTTP ${res.status}`);
        }
        return res.json();
      })
      .then((json) => {
        if (!cancelled) setData(json);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Unexpected error');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-10 md:px-8 md:py-14">
      <header className="mb-10 md:mb-12">
        <p className="mb-2 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400">
          Backend Integration
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-ink md:text-5xl">
          Department Summary
        </h1>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-stone-500 md:text-base">
          Aggregated user stats from dummyjson, grouped by company department.
        </p>
      </header>

      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          <p className="font-semibold">Failed to load departments</p>
          <p className="mt-1 text-red-600">{error}</p>
          <p className="mt-3 text-xs text-red-500">
            Make sure the user-api is running at <code>USER_API_BASE_URL</code>.
          </p>
        </div>
      )}

      {!data && !error && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="min-h-[18rem] animate-pulse rounded-3xl bg-stone-100 p-5"
              aria-hidden="true"
            >
              <div className="h-7 w-1/2 rounded-lg bg-stone-200" />
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="h-20 rounded-2xl bg-stone-200" />
                <div className="h-20 rounded-2xl bg-stone-200" />
              </div>
              <div className="mt-4 h-16 rounded-2xl bg-stone-200" />
            </div>
          ))}
        </div>
      )}

      {data && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(data).map(([name, summary]) => (
            <DepartmentCard key={name} name={name} summary={summary} />
          ))}
        </div>
      )}

      <div className="mt-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-2xl border border-stone-200 bg-card px-5 py-3 text-sm font-semibold text-ink shadow-sm transition hover:bg-stone-50"
        >
          ← Back to Fresh Sort
        </Link>
      </div>
    </main>
  );
}
