'use client';

import type { TodoItem } from '@/data/items';

interface ItemButtonProps {
  item: TodoItem;
  onClick: (item: TodoItem) => void;
}

const typeStyles = {
  Fruit: 'bg-orange-50 text-orange-900 ring-orange-200 hover:bg-orange-100 focus:ring-orange-400',
  Vegetable:
    'bg-emerald-50 text-emerald-900 ring-emerald-200 hover:bg-emerald-100 focus:ring-emerald-400',
};

export function ItemButton({ item, onClick }: ItemButtonProps) {
  return (
    <button
      type="button"
      onClick={() => onClick(item)}
      className={`w-full rounded-lg px-4 py-2.5 text-left text-sm font-medium shadow-sm ring-1 transition-colors duration-200 focus:outline-none focus:ring-2 ${typeStyles[item.type]}`}
      aria-label={`${item.name} (${item.type})`}
    >
      {item.name}
    </button>
  );
}
