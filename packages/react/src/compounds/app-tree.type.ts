/* @layer renderer-shell @kind types */
import type { APP_TREE } from './app-tree.constants';

declare module '@drizztdourden08/tessera' {
  interface TesseraApps {
    brock: { parts: 'AboutPanel' | 'PressedGrid' | 'ProfilesPanel' | 'ReleaseNotesPanel' | 'StickPlot'; tree: typeof APP_TREE };
  }
}
