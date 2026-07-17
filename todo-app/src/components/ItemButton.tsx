'use client';

import { motion } from 'motion/react';
import { Orange, Carrot } from '@phosphor-icons/react';
import type { TodoItem } from '@/data/items';

interface ItemButtonProps {
  item: TodoItem;
  onClick: (item: TodoItem) => void;
}

const typeStyles = {
  Fruit: {
    border: 'border-fruit/30',
    bg: 'bg-fruit-soft',
    text: 'text-fruit',
    badge: 'bg-fruit text-white',
    icon: Orange,
  },
  Vegetable: {
    border: 'border-vegetable/30',
    bg: 'bg-vegetable-soft',
    text: 'text-vegetable',
    badge: 'bg-vegetable text-white',
    icon: Carrot,
  },
};

export function ItemButton({ item, onClick }: ItemButtonProps) {
  const styles = typeStyles[item.type];
  const Icon = styles.icon;

  return (
    <motion.button
      type="button"
      onClick={() => onClick(item)}
      layout
      initial={{ opacity: 0, scale: 0.96, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: -8 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}
      whileTap={{ scale: 0.97 }}
      className={`
        group relative flex w-full items-center justify-between gap-3
        overflow-hidden rounded-2xl border-2 bg-card px-4 py-3.5 text-left
        shadow-sm outline-none transition-shadow duration-200 focus-visible:ring-2 focus-visible:ring-accent/50
        ${styles.border}
      `}
      aria-label={`${item.name} (${item.type})`}
    >
      <div className="flex items-center gap-3">
        <span className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${styles.bg}`}>
          <Icon weight="duotone" className={`h-5 w-5 ${styles.text}`} aria-hidden="true" />
        </span>
        <span className="font-semibold text-ink">{item.name}</span>
      </div>

      <span
        className={`
          inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold
          uppercase tracking-wider text-white
          ${styles.badge}
        `}
      >
        {item.type}
      </span>
    </motion.button>
  );
}
