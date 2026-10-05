/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';

interface ProfilesPanelCreateProps {
  close: () => void;
  required: boolean;
  error: string | null;
  extraFields?: ReactNode;
  canSubmit?: boolean;
  placeholder: string;
  onSubmit: (name: string, close: () => void) => void;
}

export type { ProfilesPanelCreateProps };
