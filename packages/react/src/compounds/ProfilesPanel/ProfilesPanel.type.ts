/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';

interface ProfilesPanelItem {
  id: string;
  name: string;
  meta?: ReactNode;
  aside?: ReactNode;
  icon?: ReactNode;
}

interface ProfilesPanelProps {
  title: ReactNode;
  profiles: readonly ProfilesPanelItem[];
  selectedId?: string | null;
  onSelect: (id: string) => void;
  onCreate?: (name: string) => Promise<void>;
  onRename?: (id: string, name: string) => Promise<void>;
  onDelete?: (id: string) => void;
  createOpen?: boolean;
  extraFields?: ReactNode;
  canSubmit?: boolean;
  placeholder?: string;
  newLabel?: string;
  className?: string;
}

interface ProfilesPanelModel {
  formShown: boolean;
  createError: string | null;
  renamingId: string | null;
  renameError: string | null;
  openCreate: () => void;
  cancelCreate: () => void;
  submitCreate: (name: string) => void;
  startRename: (id: string) => void;
  cancelRename: () => void;
  submitRename: (id: string, name: string) => void;
}

export type { ProfilesPanelItem, ProfilesPanelModel, ProfilesPanelProps };
