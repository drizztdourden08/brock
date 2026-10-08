/* @layer renderer-shell @kind constants */
import type { AppTree } from '@drizztdourden08/tessera';

const APP_TREE = [
  { at: ['layout', 'a ready-made app panel'], answers: { 'about the app': null, 'release notes': null } },
  { at: ['navigation'], answers: { 'between profiles': null } },
  { at: ['data', 'controller or keyboard input'], answers: { 'a calibration step': null } },
  { at: ['actions', 'one action'], answers: { 'installs a catalogue item, with its progress': null } },
] as const satisfies AppTree;

export { APP_TREE };
