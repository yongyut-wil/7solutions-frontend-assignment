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
    <div className="mx-auto max-w-5xl px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-stone-800">
          Auto Delete Todo List
        </h1>
        <p className="mt-2 text-sm text-stone-500">
          Click an item to move it. It returns to the main list after 5 seconds.
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
