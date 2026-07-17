'use client';

import type { TodoItem } from '@/data/items';

interface ItemButtonProps {
  item: TodoItem;
  onClick: (item: TodoItem) => void;
}

const typeStyles = {
  Fruit: {
    border: 'border-fruit/20',
    bg: 'bg-fruit-soft',
    text: 'text-fruit',
    badge: 'bg-fruit text-white',
  },
  Vegetable: {
    border: 'border-vegetable/20',
    bg: 'bg-vegetable-soft',
    text: 'text-sage',
    badge: 'bg-vegetable text-white',
  },
};

function TypeIcon({ type }: { type: TodoItem['type'] }) {
  if (type === 'Fruit') {
    return (
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
        <path d="M12 12 8 8" strokeLinecap="round" />
      </svg>
    );
  }
  return (
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
      <path d="M12 12c-2 2-2 5 0 8" strokeLinecap="round" />
      <path d="M12 12c2 2 2 5 0 8" strokeLinecap="round" />
    </svg>
  );
}

export function ItemButton({ item, onClick }: ItemButtonProps) {
  const styles = typeStyles[item.type];

  return (
    <button
      type="button"
      onClick={() => onClick(item)}
      className={`
        group relative flex w-full animate-pop-in items-center justify-between
        overflow-hidden rounded-2xl border bg-card px-4 py-3.5 text-left shadow-sm
        transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md
        active:scale-[0.98] active:shadow-inner
        ${styles.border} ${styles.bg}
      `}
      aria-label={`${item.name} (${item.type})`}
    >
      <span className="animate-shimmer pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100" />
      <span className="relative font-medium text-ink">{item.name}</span>
      <span
        className={`
          relative inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold
          uppercase tracking-wide transition-transform group-hover:scale-105
          ${styles.badge}
        `}
      >
        <TypeIcon type={item.type} />
        {item.type}
      </span>
    </button>
  );
}
