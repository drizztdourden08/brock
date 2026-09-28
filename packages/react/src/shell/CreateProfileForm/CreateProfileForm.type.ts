/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';

interface CreateProfileFormProps {
  onCreate: (name: string) => void;
  onCancel?: () => void;
  extraFields?: ReactNode;
  canSubmit?: boolean;
  error?: string | null;
  placeholder?: string;
  submitLabel?: string;
}

export type { CreateProfileFormProps };
