import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

vi.mock('motion/react', async () => {
  const React = await import('react');

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

  const motionProxy = new Proxy(
    {},
    {
      get(_, tag: string) {
        const Component = React.forwardRef(function MockMotion(
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
        return Component;
      },
    }
  );

  return {
    motion: motionProxy as typeof import('motion/react').motion,
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
