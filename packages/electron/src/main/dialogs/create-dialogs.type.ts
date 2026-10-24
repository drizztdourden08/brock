/* @layer electron-main @kind types */
import type { BrowserWindow } from 'electron';
import type { AutomationFlags } from '@drizztdourden08/brock-core/automation';

interface DialogsInput {
  flags: AutomationFlags;
  window: () => BrowserWindow | null;
  log: (message: string) => void;
}

export type { DialogsInput };
