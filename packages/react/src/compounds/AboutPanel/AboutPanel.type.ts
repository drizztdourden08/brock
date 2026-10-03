/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';
import type { BrandApp } from '@drizztdourden08/tessera/brand';

interface AboutPanelRow {
  label: string;
  value: ReactNode;
}

type AboutPanelHeading = 'wordmark' | 'title';

interface AboutPanelProps {
  title: string;
  brand?: BrandApp;
  heading?: AboutPanelHeading;
  logo?: string;
  rows: readonly AboutPanelRow[];
  copyText?: string | null;
  copyLabel?: string;
  legal?: ReactNode;
  className?: string;
}

export type { AboutPanelHeading, AboutPanelProps, AboutPanelRow };
