'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useTodoStore } from '@/store/todoStore';
import { Column } from './Column';

export function TodoBoard() {
  const mainList = useTodoStore((state) => state.mainList);
  const fruitColumn = useTodoStore((state) => state.columns.Fruit);
  const vegetableColumn = useTodoStore((state) => state.columns.Vegetable);
  const moveToColumn = useTodoStore((state) => state.moveToColumn);
  const returnToMain = useTodoStore((state) => state.returnToMain);
  const reset = useTodoStore((state) => state.reset);

  useEffect(() => reset, [reset]);

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-10 md:px-8 md:py-14">
      <header className="mb-10 md:mb-12">
        <p className="mb-2 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400">
          Produce Sorting Game
        </p>
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-ink md:text-5xl">Fresh Sort</h1>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-stone-500 md:text-base">
              Tap a card to sort it into the right basket. It hops back to the main list after 5
              seconds.
            </p>
          </div>
          <Link
            href="/departments"
            className="inline-flex items-center justify-center rounded-2xl border border-stone-200 bg-card px-5 py-3 text-sm font-semibold text-ink shadow-sm transition hover:bg-stone-50"
          >
            View Departments →
          </Link>
        </div>
      </header>

      <div className="flex flex-col gap-5 lg:flex-row">
        <div className="lg:w-2/3">
          <Column title="Main List" items={mainList} onItemClick={moveToColumn} />
        </div>
        <div className="flex flex-col gap-5 lg:w-1/3">
          <Column title="Fruit" items={fruitColumn} onItemClick={returnToMain} />
          <Column title="Vegetable" items={vegetableColumn} onItemClick={returnToMain} />
        </div>
      </div>
    </div>
  );
}
