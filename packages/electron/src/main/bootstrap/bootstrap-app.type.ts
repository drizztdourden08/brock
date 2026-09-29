/* @layer electron-main @kind types */
import type { BrowserWindow } from 'electron';
import type { BootstrapOptions, MainContext } from '../types/main-context.type';

interface ReadyInput {
  ctx: MainContext;
  options: BootstrapOptions;
  dataDirs: string[];
  openWindow: () => BrowserWindow;
  windowIcon?: string;
}

export type { ReadyInput };
