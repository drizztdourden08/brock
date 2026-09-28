/* @layer renderer-shell @kind barrel */
export { BrockApp } from './BrockApp';
export type { BrockAppLayout, BrockAppProps, BrockAppSettings } from './BrockApp.type';
export { useConfirmDialog } from './behavior/useConfirmDialog';
export { useShellReady } from './behavior/useShellReady';
export { useStartup } from './behavior/useStartup';
export { useKeyboardShortcuts } from './behavior/useKeyboardShortcuts';
export { buildMenu } from './behavior/build-menu';
export { BUILT_IN_ENTRIES } from './BrockApp.constants';
