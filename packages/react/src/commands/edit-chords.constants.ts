/* @layer renderer-shell @kind constants */
import type { EditRole } from '@drizztdourden08/brock-core';

const EDIT_CHORDS: Readonly<Record<EditRole, { mac: readonly string[]; other: readonly string[] }>> = {
  undo: { mac: ['Mod+Z'], other: ['Mod+Z'] },
  redo: { mac: ['Mod+Shift+Z'], other: ['Mod+Y', 'Mod+Shift+Z'] },
  cut: { mac: ['Mod+X'], other: ['Mod+X'] },
  copy: { mac: ['Mod+C'], other: ['Mod+C'] },
  paste: { mac: ['Mod+V'], other: ['Mod+V'] },
  selectAll: { mac: ['Mod+A'], other: ['Mod+A'] },
};

export { EDIT_CHORDS };
