/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';

type DashboardSpan = 1 | 2 | 'full';

interface DashboardCardProps {
  span?: DashboardSpan;
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
}

export type { DashboardCardProps, DashboardSpan };
