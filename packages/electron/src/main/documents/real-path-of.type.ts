/* @layer electron-main @kind types */
type Lookup = { kind: 'real'; real: string } | { kind: 'refused' } | { kind: 'absent' } | { kind: 'appeared' };

export type { Lookup };
