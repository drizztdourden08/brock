/* @layer renderer-shell @kind types */
interface ParsedShortcut {
  ctrl: boolean;
  shift: boolean;
  alt: boolean;
  meta: boolean;
  mod: boolean;
  key: string;
}

export type { ParsedShortcut };
