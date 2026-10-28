/* @layer electron-main @kind types */
import type { NativeImage } from 'electron';

interface DragOutDeps {
  resolve: (path: string) => Promise<string>;
  fromApp: () => boolean;
  icon: (path: string) => Promise<NativeImage>;
  start: (files: string[], icon: NativeImage) => void;
}

export type { DragOutDeps };
