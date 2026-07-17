import { create } from 'zustand';
import { INITIAL_ITEMS, type ItemType, type TodoItem } from '@/data/items';

export interface TodoState {
  mainList: TodoItem[];
  columns: Record<ItemType, TodoItem[]>;
  moveToColumn: (item: TodoItem) => void;
  returnToMain: (item: TodoItem) => void;
  reset: () => void;
}

// Module-level timer map keeps timeout handles out of React state.
// keyed by item name because the dataset has unique names.
const timers = new Map<string, ReturnType<typeof setTimeout>>();

export const useTodoStore = create<TodoState>((set, get) => ({
  mainList: [...INITIAL_ITEMS],
  columns: { Fruit: [], Vegetable: [] },

  moveToColumn: (item) => {
    if (timers.has(item.name)) return;

    const timeout = setTimeout(() => {
      timers.delete(item.name);
      get().returnToMain(item);
    }, 5000);

    timers.set(item.name, timeout);

    set((state) => ({
      mainList: state.mainList.filter((i) => i.name !== item.name),
      columns: {
        ...state.columns,
        [item.type]: [...state.columns[item.type], item],
      },
    }));
  },

  returnToMain: (item) => {
    const timeout = timers.get(item.name);
    if (timeout) {
      clearTimeout(timeout);
      timers.delete(item.name);
    }

    set((state) => {
      if (state.mainList.some((i) => i.name === item.name)) return state;

      return {
        mainList: [...state.mainList, item],
        columns: {
          ...state.columns,
          [item.type]: state.columns[item.type].filter((i) => i.name !== item.name),
        },
      };
    });
  },

  reset: () => {
    timers.forEach((t) => clearTimeout(t));
    timers.clear();
    set({ mainList: [...INITIAL_ITEMS], columns: { Fruit: [], Vegetable: [] } });
  },
}));

// Exposed for tests that need to inspect or clear timers without knowing internals.
export function clearAllTimers() {
  timers.forEach((t) => clearTimeout(t));
  timers.clear();
}
