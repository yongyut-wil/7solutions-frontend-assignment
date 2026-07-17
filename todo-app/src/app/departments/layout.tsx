import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Department Summary',
  description:
    'Aggregated user stats from dummyjson grouped by company department, powered by a Fastify + ConnectRPC backend.',
  openGraph: {
    title: 'Department Summary',
    description:
      'Aggregated user stats from dummyjson grouped by company department, powered by a Fastify + ConnectRPC backend.',
    url: '/departments',
  },
};

export default function DepartmentsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
