/* @layer electron-main @kind constants */
import type { EditItem } from './edit-menu.type';

const EDIT_ASK_TIMEOUT_MS = 500;

const EDIT_ITEMS: readonly (EditItem | 'separator')[] = [
  { role: 'undo', label: 'Undo', accelerator: { mac: 'Cmd+Z', other: 'Ctrl+Z' } },
  { role: 'redo', label: 'Redo', accelerator: { mac: 'Shift+Cmd+Z', other: 'Ctrl+Y' } },
  'separator',
  { role: 'cut', label: 'Cut', accelerator: { mac: 'Cmd+X', other: 'Ctrl+X' } },
  { role: 'copy', label: 'Copy', accelerator: { mac: 'Cmd+C', other: 'Ctrl+C' } },
  { role: 'paste', label: 'Paste', accelerator: { mac: 'Cmd+V', other: 'Ctrl+V' } },
  { role: 'selectAll', label: 'Select All', accelerator: { mac: 'Cmd+A', other: 'Ctrl+A' } },
];

export { EDIT_ASK_TIMEOUT_MS, EDIT_ITEMS };
