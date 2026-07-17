'use client';

import type { TodoItem } from '@/data/items';
import { ItemButton } from './ItemButton';

interface ColumnProps {
  title: string;
  items: TodoItem[];
  onItemClick: (item: TodoItem) => void;
}

export function Column({ title, items, onItemClick }: ColumnProps) {
  return (
    <section
      className="flex min-h-[12rem] flex-col rounded-xl border border-stone-200 bg-white p-4 shadow-sm"
      aria-labelledby={`column-${title}`}
    >
      <h2
        id={`column-${title}`}
        className="mb-3 text-xs font-semibold uppercase tracking-wider text-stone-500"
      >
        {title}
        <span className="ml-2 rounded-full bg-stone-100 px-2 py-0.5 text-stone-600">
          {items.length}
        </span>
      </h2>
      <div className="flex flex-col gap-2">
        {items.length === 0 ? (
          <p className="py-6 text-center text-sm text-stone-400">No items yet.</p>
        ) : (
          items.map((item) => <ItemButton key={item.name} item={item} onClick={onItemClick} />)
        )}
      </div>
    </section>
  );
}
