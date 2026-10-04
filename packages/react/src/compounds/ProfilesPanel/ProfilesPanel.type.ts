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

interface ProfilesPanelPick {
  id: string;
  from: string | null;
}

interface PressHandlers {
  onClickCapture: () => void;
  onClick: () => void;
  onKeyDownCapture: () => void;
}

interface PressFlag {
  handlers: PressHandlers;
  take: () => boolean;
}

interface ProfilesPanelModel {
  createShown: boolean;
  createError: string | null;
  renameError: string | null;
  pickedId: string | null;
  pressHandlers: PressHandlers;
  openChange: (open: boolean) => void;
  submitCreate: (name: string, close: () => void) => void;
  submitRename: (id: string, name: string) => void;
  pick: (id: string) => void;
}

export type { PressFlag, ProfilesPanelItem, ProfilesPanelModel, ProfilesPanelPick, ProfilesPanelProps };
