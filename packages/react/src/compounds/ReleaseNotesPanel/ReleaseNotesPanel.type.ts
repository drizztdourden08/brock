/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';

interface ReleaseNotesPanelProps {
  title?: ReactNode;
  children: ReactNode;
  markdown?: boolean;
  onOpenLink?: (href: string) => void;
  className?: string;
}

export type { ReleaseNotesPanelProps };
