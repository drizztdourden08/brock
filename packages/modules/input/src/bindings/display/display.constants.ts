/* @layer core @kind constants */
import { SDL_AXIS } from '../../input.constants';

const AXIS_FALLBACK_GLYPHS: Record<number, Record<'-' | '+', string>> = {
  [SDL_AXIS.LEFTX]: { '-': 'generic-stick-left', '+': 'generic-stick-right' },
  [SDL_AXIS.RIGHTX]: { '-': 'generic-stick-left', '+': 'generic-stick-right' },
  [SDL_AXIS.LEFTY]: { '-': 'generic-stick-up', '+': 'generic-stick-down' },
  [SDL_AXIS.RIGHTY]: { '-': 'generic-stick-up', '+': 'generic-stick-down' },
  [SDL_AXIS.LEFT_TRIGGER]: { '-': 'generic-trigger-a', '+': 'generic-trigger-a' },
  [SDL_AXIS.RIGHT_TRIGGER]: { '-': 'generic-trigger-b', '+': 'generic-trigger-b' },
};

const KEY_CODE_LABELS: Record<string, string> = {
  ArrowUp: 'Arrow Up', ArrowDown: 'Arrow Down', ArrowLeft: 'Arrow Left', ArrowRight: 'Arrow Right',
  ShiftLeft: 'L.Shift', ShiftRight: 'R.Shift',
  ControlLeft: 'L.Ctrl', ControlRight: 'R.Ctrl',
  AltLeft: 'L.Alt', AltRight: 'R.Alt',
  Enter: 'Enter', Space: 'Space', Backspace: 'Bksp',
  Tab: 'Tab', Escape: 'Esc', CapsLock: 'Caps',
  PageUp: 'Page Up', PageDown: 'Page Down',
};

const KEY_CODE_GLYPHS: Record<string, string> = {
  ArrowUp: 'kb-arrow-up', ArrowDown: 'kb-arrow-down',
  ArrowLeft: 'kb-arrow-left', ArrowRight: 'kb-arrow-right',
  Space: 'kb-space', Enter: 'kb-enter', NumpadEnter: 'kb-enter',
  ShiftLeft: 'kb-shift', ShiftRight: 'kb-shift',
  ControlLeft: 'kb-ctrl', ControlRight: 'kb-ctrl',
  AltLeft: 'kb-alt', AltRight: 'kb-alt',
  Tab: 'kb-tab', Escape: 'kb-escape',
  Backspace: 'kb-backspace', CapsLock: 'kb-capslock',
  Delete: 'kb-delete', Home: 'kb-home', End: 'kb-end',
  PageUp: 'kb-pageup', PageDown: 'kb-pagedown', Insert: 'kb-insert',
  Comma: 'kb-comma', Period: 'kb-period', Semicolon: 'kb-semicolon',
  Quote: 'kb-quote', Slash: 'kb-slash', Backslash: 'kb-backslash',
  Minus: 'kb-minus', Equal: 'kb-equals',
  BracketLeft: 'kb-bracketopen', BracketRight: 'kb-bracketclose',
  Backquote: 'kb-tilde',
};

export { AXIS_FALLBACK_GLYPHS, KEY_CODE_GLYPHS, KEY_CODE_LABELS };
