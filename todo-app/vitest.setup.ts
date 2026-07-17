import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';
import React from 'react';

function createMotionComponent(tag: string) {
  const motionPropKeys = new Set([
    'initial',
    'animate',
    'exit',
    'whileHover',
    'whileTap',
    'transition',
    'layout',
    'whileFocus',
    'whileDrag',
  ]);
  return React.forwardRef(function MockMotion(
    props: Record<string, unknown>,
    ref: React.Ref<HTMLElement>
  ) {
    const Tag = tag as keyof React.JSX.IntrinsicElements;
    const rest = Object.fromEntries(
      Object.entries(props).filter(([key]) => !motionPropKeys.has(key))
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return React.createElement(Tag as any, { ref, ...rest });
  });
}

function createMotionMock() {
  return new Proxy(
    {},
    {
      get(_, tag: string) {
        return createMotionComponent(tag);
      },
    }
  );
}

vi.mock('motion/react', () => {
  const motionProxy = createMotionMock();

  return {
    motion: motionProxy as typeof import('motion/react').motion,
    LazyMotion: function LazyMotion({ children }: { children: React.ReactNode }) {
      return children;
    },
    domAnimation: {},
    AnimatePresence: function AnimatePresence({ children }: { children: React.ReactNode }) {
      return children;
    },
    LayoutGroup: function LayoutGroup({ children }: { children: React.ReactNode }) {
      return children;
    },
    MotionConfig: function MotionConfig({ children }: { children: React.ReactNode }) {
      return children;
    },
  };
});

vi.mock('motion/react-m', () => {
  return {
    button: createMotionComponent('button'),
  };
});
