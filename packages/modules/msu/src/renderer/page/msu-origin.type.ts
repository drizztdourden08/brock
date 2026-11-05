/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';

type DeleteConfirm = (title: string, message: string, onConfirm: () => void) => void;

interface MsuOriginState {
  readOnly: boolean;
  banner: ReactNode;
  badge: (packName: string) => ReactNode;
  isInstalled: (packName: string) => boolean;
  nameTaken: (packName: string) => boolean;
  error: string | null;
  onDelete: (packName: string) => void;
}

interface MsuOriginArgs {
  selected: string | null;
  refreshThenSelect: (name: string) => void;
  setSelected: (name: string | null) => void;
  refresh: () => Promise<void>;
  onDeleteConfirm: DeleteConfirm;
}

type MsuPackOrigin = (args: MsuOriginArgs) => MsuOriginState;

export type { DeleteConfirm, MsuOriginState, MsuPackOrigin };
