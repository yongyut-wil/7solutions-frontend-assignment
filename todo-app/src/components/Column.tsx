'use client';

import { Basket, Orange, Carrot } from '@phosphor-icons/react';
import type { TodoItem } from '@/data/items';
import { ItemButton } from './ItemButton';

interface ColumnProps {
  title: string;
  items: TodoItem[];
  onItemClick: (item: TodoItem) => void;
}

const headerStyles: Record<string, { accent: string; soft: string; icon: typeof Basket }> = {
  'Main List': {
    accent: 'text-ink',
    soft: 'bg-muted',
    icon: Basket,
  },
  Fruit: {
    accent: 'text-fruit',
    soft: 'bg-fruit-soft',
    icon: Orange,
  },
  Vegetable: {
    accent: 'text-vegetable',
    soft: 'bg-vegetable-soft',
    icon: Carrot,
  },
};

export function Column({ title, items, onItemClick }: ColumnProps) {
  const style = headerStyles[title] ?? headerStyles['Main List'];
  const Icon = style.icon;
  const headingId = `column-${title.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <section
      className="flex w-full min-h-[16rem] flex-col rounded-3xl border border-stone-200/70 bg-card/90 p-5 shadow-sm"
      aria-labelledby={headingId}
    >
      <div className="mb-5 flex items-center justify-between">
        <div className={`flex items-center gap-2.5 ${style.accent}`}>
          <span
            className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${style.soft}`}
          >
            <Icon weight="duotone" className="h-4.5 w-4.5" aria-hidden="true" />
          </span>
          <h2 id={headingId} className="text-lg font-bold tracking-tight">
            {title}
          </h2>
        </div>
        <span
          className={`
            font-mono inline-flex h-7 min-w-7 items-center justify-center rounded-full px-2 text-[11px] font-semibold
            ${style.soft} ${style.accent}
          `}
          aria-label={`${items.length} items in ${title}`}
        >
          {items.length}
        </span>
      </div>

      <div className="flex min-h-[10rem] flex-1 flex-col gap-2.5">
        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-stone-200 p-6 text-center">
            <Basket weight="thin" className="mb-2 h-8 w-8 text-stone-300" aria-hidden="true" />
            <p className="text-sm font-medium text-stone-400">Basket empty</p>
            <p className="mt-1 text-xs text-stone-300">Tap a produce card from the main list.</p>
          </div>
        ) : (
          items.map((item) => <ItemButton key={item.name} item={item} onClick={onItemClick} />)
        )}
      </div>
    </section>
  );
}
