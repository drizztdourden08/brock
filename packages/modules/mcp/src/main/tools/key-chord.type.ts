/* @layer electron-main @kind types */
type KeyModifier = 'shift' | 'control' | 'alt' | 'meta';

interface KeyChord {
  keyCode: string;
  modifiers: KeyModifier[];
  text: string | null;
}

export type { KeyModifier, KeyChord };
