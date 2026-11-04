/* @layer electron-main @kind test */
import { describe, expect, it } from 'vitest';
import { parseKeyChord } from '../src/main/tools/parse-key-chord';

describe('I-131 key chords', { tags: ['critical'] }, () => {
  it('parses a named key and a letter', () => {
    expect(parseKeyChord('Enter')).toEqual({ keyCode: 'Enter', modifiers: [], text: null });
    expect(parseKeyChord('a')).toEqual({ keyCode: 'a', modifiers: [], text: 'a' });
  });

  it('parses modifiers and drops the typed text under control, alt or meta', () => {
    expect(parseKeyChord('Ctrl+Shift+S')).toEqual({ keyCode: 'S', modifiers: ['control', 'shift'], text: null });
    expect(parseKeyChord('shift+a')).toEqual({ keyCode: 'a', modifiers: ['shift'], text: 'a' });
  });

  it('reads the plus key and function keys', () => {
    expect(parseKeyChord('Ctrl++')).toEqual({ keyCode: '+', modifiers: ['control'], text: null });
    expect(parseKeyChord('+')).toEqual({ keyCode: '+', modifiers: [], text: '+' });
    expect(parseKeyChord('f12')?.keyCode).toBe('F12');
  });

  it('refuses what it does not know', () => {
    expect(parseKeyChord('Hyper+A')).toBeNull();
    expect(parseKeyChord('Banana')).toBeNull();
    expect(parseKeyChord('')).toBeNull();
  });
});
