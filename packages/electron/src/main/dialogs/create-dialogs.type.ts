/* @layer electron-main @kind types */
import type { BrowserWindow } from 'electron';
import type { AutomationFlags } from '@drizztdourden08/brock-core/automation';

interface DialogsInput {
  flags: AutomationFlags;
  window: () => BrowserWindow | null;
  log: (message: string) => void;
}

interface BoxSpec {
  kind: 'confirm' | 'choose';
  title: string;
  message: string;
  detail?: string;
  buttons: string[];
  defaultId: number;
  cancelId: number;
  showOnAutomation?: boolean;
}

export type { BoxSpec, DialogsInput };
