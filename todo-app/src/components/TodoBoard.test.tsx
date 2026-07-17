import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, act, within } from '@testing-library/react';
import { TodoBoard } from './TodoBoard';
import { useTodoStore, clearAllTimers } from '@/store/todoStore';
import { INITIAL_ITEMS } from '@/data/items';

describe('TodoBoard', () => {
  beforeEach(() => {
    clearAllTimers();
    useTodoStore.setState({ mainList: [...INITIAL_ITEMS], columns: { Fruit: [], Vegetable: [] } });
  });

  afterEach(() => {
    clearAllTimers();
    vi.useRealTimers();
  });

  const getColumn = (title: string) => {
    const heading = screen.getByRole('heading', { name: new RegExp(`^${title}`) });
    return within(heading.closest('section')!);
  };

  it('moves a clicked fruit into the Fruit column and returns it after 5 seconds', () => {
    vi.useFakeTimers();
    render(<TodoBoard />);

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Apple (Fruit)' }));
    });

    expect(
      getColumn('Main List').queryByRole('button', { name: 'Apple (Fruit)' })
    ).not.toBeInTheDocument();
    expect(getColumn('Fruit').getByRole('button', { name: 'Apple (Fruit)' })).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(
      getColumn('Main List').getByRole('button', { name: 'Apple (Fruit)' })
    ).toBeInTheDocument();
    expect(
      getColumn('Fruit').queryByRole('button', { name: 'Apple (Fruit)' })
    ).not.toBeInTheDocument();
  });

  it('returns a column item to the main list immediately when clicked', () => {
    vi.useFakeTimers();
    render(<TodoBoard />);

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Apple (Fruit)' }));
    });
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Apple (Fruit)' }));
    });

    expect(
      getColumn('Main List').getByRole('button', { name: 'Apple (Fruit)' })
    ).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(screen.getAllByRole('button', { name: 'Apple (Fruit)' })).toHaveLength(1);
  });
});
