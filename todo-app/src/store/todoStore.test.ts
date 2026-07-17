import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useTodoStore, clearAllTimers } from './todoStore';
import { INITIAL_ITEMS } from '@/data/items';

describe('todoStore', () => {
  beforeEach(() => {
    clearAllTimers();
    useTodoStore.setState(
      useTodoStore.getInitialState?.() ?? {
        mainList: [...INITIAL_ITEMS],
        columns: { Fruit: [], Vegetable: [] },
      }
    );
  });

  afterEach(() => {
    clearAllTimers();
  });

  it('moves a main item to the correct column and sets a 5s return timer', () => {
    vi.useFakeTimers();
    const apple = INITIAL_ITEMS[0];

    useTodoStore.getState().moveToColumn(apple);

    expect(useTodoStore.getState().mainList).not.toContainEqual(apple);
    expect(useTodoStore.getState().columns.Fruit).toContainEqual(apple);

    vi.advanceTimersByTime(4999);
    expect(useTodoStore.getState().columns.Fruit).toContainEqual(apple);

    vi.advanceTimersByTime(1);
    expect(useTodoStore.getState().columns.Fruit).not.toContainEqual(apple);
    expect(useTodoStore.getState().mainList.at(-1)).toEqual(apple);

    vi.useRealTimers();
  });

  it('returns an item to the bottom of the main list immediately when clicked in a column', () => {
    vi.useFakeTimers();
    const apple = INITIAL_ITEMS[0];
    const broccoli = INITIAL_ITEMS[1];

    useTodoStore.getState().moveToColumn(apple);
    useTodoStore.getState().moveToColumn(broccoli);

    useTodoStore.getState().returnToMain(apple);

    expect(useTodoStore.getState().columns.Fruit).toHaveLength(0);
    expect(useTodoStore.getState().columns.Vegetable).toContainEqual(broccoli);
    expect(useTodoStore.getState().mainList.at(-1)).toEqual(apple);

    vi.advanceTimersByTime(5000);
    expect(useTodoStore.getState().mainList.filter((i) => i.name === apple.name)).toHaveLength(1);

    vi.useRealTimers();
  });

  it('ignores rapid clicks on an item already in a column', () => {
    const apple = INITIAL_ITEMS[0];

    useTodoStore.getState().moveToColumn(apple);
    useTodoStore.getState().moveToColumn(apple);

    expect(useTodoStore.getState().columns.Fruit.filter((i) => i.name === apple.name)).toHaveLength(
      1
    );
  });

  it('keeps FIFO order when multiple items return to main', () => {
    vi.useFakeTimers();
    const apple = INITIAL_ITEMS[0];
    const banana = INITIAL_ITEMS[3];

    useTodoStore.getState().moveToColumn(apple);
    useTodoStore.getState().moveToColumn(banana);
    vi.advanceTimersByTime(5000);

    const fruitNames = useTodoStore.getState().columns.Fruit.map((i) => i.name);
    expect(fruitNames).toHaveLength(0);

    const tail = useTodoStore
      .getState()
      .mainList.slice(-2)
      .map((i) => i.name);
    expect(tail).toEqual([apple.name, banana.name]);

    vi.useRealTimers();
  });

  it('reset clears all timers and restores initial state', () => {
    vi.useFakeTimers();
    const apple = INITIAL_ITEMS[0];

    useTodoStore.getState().moveToColumn(apple);
    useTodoStore.getState().reset();

    expect(useTodoStore.getState().mainList).toEqual(INITIAL_ITEMS);
    expect(useTodoStore.getState().columns.Fruit).toHaveLength(0);

    vi.advanceTimersByTime(5000);
    expect(useTodoStore.getState().mainList).toEqual(INITIAL_ITEMS);

    vi.useRealTimers();
  });
});
