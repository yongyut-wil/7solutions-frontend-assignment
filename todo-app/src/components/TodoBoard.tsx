'use client';

import { useEffect } from 'react';
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
    <div className="mx-auto max-w-6xl px-6 py-10 md:py-16">
      <header className="mb-10 text-center md:mb-14">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">
          Produce Sorting Game
        </p>
        <h1 className="font-display text-4xl font-semibold text-ink md:text-5xl">Fresh Sort</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-stone-500">
          Click a card in the main basket to sort it into the right bin. Items return home after 5
          seconds.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        <Column title="Main List" items={mainList} onItemClick={moveToColumn} />
        <Column title="Fruit" items={fruitColumn} onItemClick={returnToMain} />
        <Column title="Vegetable" items={vegetableColumn} onItemClick={returnToMain} />
      </div>
    </div>
  );
}
