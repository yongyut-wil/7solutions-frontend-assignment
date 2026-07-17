'use client';

import type { TodoItem } from '@/data/items';
import { ItemButton } from './ItemButton';

interface ColumnProps {
  title: string;
  items: TodoItem[];
  onItemClick: (item: TodoItem) => void;
}

const headerStyles: Record<string, { accent: string; soft: string; icon: React.ReactNode }> = {
  'Main List': {
    accent: 'text-ink',
    soft: 'bg-muted',
    icon: (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="3" y="3" width="18" height="18" rx="4" />
        <path d="M7 12h10M12 7v10" strokeLinecap="round" />
      </svg>
    ),
  },
  Fruit: {
    accent: 'text-fruit',
    soft: 'bg-fruit-soft',
    icon: (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 3c0 0 2-2 4-1" strokeLinecap="round" />
      </svg>
    ),
  },
  Vegetable: {
    accent: 'text-sage',
    soft: 'bg-vegetable-soft',
    icon: (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M12 2c-4 4-8 8-8 12 0 3 3 6 8 6s8-3 8-6c0-4-4-8-8-12z" />
        <path d="M12 8v10" strokeLinecap="round" />
      </svg>
    ),
  },
};

export function Column({ title, items, onItemClick }: ColumnProps) {
  const style = headerStyles[title] ?? headerStyles['Main List'];
  const headingId = `column-${title.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <section
      className="flex min-h-[16rem] flex-col rounded-3xl border border-stone-200/70 bg-card/80 p-5 shadow-sm backdrop-blur-sm"
      aria-labelledby={headingId}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className={`flex items-center gap-2 ${style.accent}`}>
          {style.icon}
          <h2 id={headingId} className="font-display text-lg font-semibold">
            {title}
          </h2>
        </div>
        <span
          className={`
            inline-flex h-7 min-w-7 items-center justify-center rounded-full px-2.5 text-xs font-semibold
            ${style.soft} ${style.accent}
          `}
        >
          {items.length}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2.5">
        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-stone-200 p-6 text-center">
            <p className="text-sm font-medium text-stone-400">Empty basket</p>
            <p className="mt-1 text-xs text-stone-300">
              Click an item from the main list to sort it here.
            </p>
          </div>
        ) : (
          items.map((item) => <ItemButton key={item.name} item={item} onClick={onItemClick} />)
        )}
      </div>
    </section>
  );
}
