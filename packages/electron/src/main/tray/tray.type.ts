/* @layer electron-main @kind types */
import type { ProductTray } from '@drizztdourden08/brock-core/product';

type TrayItemHandler = (id: string) => void;

interface TrayControl {
  set: (spec: ProductTray) => void;
  clear: () => void;
  onItem: (handler: TrayItemHandler) => () => void;
  readonly active: boolean;
}

interface TrayInput {
  productName: string;
  icon: string | undefined;
  show: () => Promise<void>;
  quit: () => void;
  log: (message: string, level?: 'info' | 'warn' | 'error') => void;
}

interface TrayMenuActions {
  show: () => void;
  quit: () => void;
  pick: TrayItemHandler;
}

export type { TrayControl, TrayInput, TrayItemHandler, TrayMenuActions };
