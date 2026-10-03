/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';

interface ProfilesPanelCreateProps {
  title: ReactNode;
  canCreate: boolean;
  formShown: boolean;
  createOpen: boolean;
  error: string | null;
  extraFields?: ReactNode;
  canSubmit?: boolean;
  placeholder?: string;
  newLabel?: string;
  onOpen: () => void;
  onSubmit: (name: string) => void;
  onCancel: () => void;
}

export type { ProfilesPanelCreateProps };
