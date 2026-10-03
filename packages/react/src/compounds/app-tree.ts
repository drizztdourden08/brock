/* @layer renderer-shell @kind data */
import type { AppTree } from '@drizztdourden08/tessera';

const APP_TREE = [
  { at: ['layout', 'a ready-made app panel'], answers: { 'about the app': null, 'release notes': null } },
  { at: ['navigation'], answers: { 'between profiles': null } },
  { at: ['data', 'controller or keyboard input'], answers: { 'a calibration step': null } },
] as const satisfies AppTree;

declare module '@drizztdourden08/tessera' {
  interface TesseraApps {
    brock: { parts: 'AboutPanel' | 'CalibrationPanel' | 'ProfilesPanel' | 'ReleaseNotesPanel'; tree: typeof APP_TREE };
  }
}

export { APP_TREE };
