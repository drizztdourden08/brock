/* @layer electron-main @kind logic */
import type { KeyChord, KeyModifier } from './key-chord.type';
import { KEY_FUNCTION, KEY_MODIFIERS, KEY_NAMES, KEY_PLUS, KEY_TYPING_BLOCKERS } from './key-chord.constants';

const splitChord = (text: string): { names: string[]; key: string } => {
  if (text.endsWith(KEY_PLUS)) {
    const head = text.slice(0, -1).replace(/\+$/, '');
    return { names: head === '' ? [] : head.split(KEY_PLUS), key: KEY_PLUS };
  }
  const parts = text.split(KEY_PLUS);
  return { names: parts.slice(0, -1), key: parts[parts.length - 1] ?? '' };
};

const keyCodeOf = (key: string): string | null => {
  if (key.length === 1) return key;
  const lower = key.toLowerCase();
  if (KEY_FUNCTION.test(lower)) return lower.toUpperCase();
  return KEY_NAMES[lower] ?? null;
};

const modifiersOf = (names: string[]): KeyModifier[] | null => {
  const found = new Set<KeyModifier>();
  for (const name of names) {
    const modifier = KEY_MODIFIERS[name.trim().toLowerCase()];
    if (modifier === undefined) return null;
    found.add(modifier);
  }
  return [...found];
};

const parseKeyChord = (chord: string): KeyChord | null => {
  const { names, key } = splitChord(chord.trim());
  const modifiers = modifiersOf(names);
  const keyCode = keyCodeOf(key);
  if (modifiers === null || keyCode === null) return null;
  const typed = keyCode.length === 1 && !modifiers.some((each) => KEY_TYPING_BLOCKERS.includes(each));
  return { keyCode, modifiers, text: typed ? keyCode : null };
};

export { parseKeyChord };
