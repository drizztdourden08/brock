/* @layer core @kind constants */
import { msg } from '@drizztdourden08/brock-core/i18n';
import type { Text } from '@drizztdourden08/brock-core/i18n';
import { SDL_AXIS } from '../../input.constants';

const AXIS_FALLBACK_GLYPHS: Record<number, Record<'-' | '+', string>> = {
  [SDL_AXIS.LEFTX]: { '-': 'generic-stick-left', '+': 'generic-stick-right' },
  [SDL_AXIS.RIGHTX]: { '-': 'generic-stick-left', '+': 'generic-stick-right' },
  [SDL_AXIS.LEFTY]: { '-': 'generic-stick-up', '+': 'generic-stick-down' },
  [SDL_AXIS.RIGHTY]: { '-': 'generic-stick-up', '+': 'generic-stick-down' },
  [SDL_AXIS.LEFT_TRIGGER]: { '-': 'generic-trigger-a', '+': 'generic-trigger-a' },
  [SDL_AXIS.RIGHT_TRIGGER]: { '-': 'generic-trigger-b', '+': 'generic-trigger-b' },
};

const KEY_CODE_LABELS: Record<string, Text> = {
  ArrowUp: msg('input:key.arrowUp'), ArrowDown: msg('input:key.arrowDown'),
  ArrowLeft: msg('input:key.arrowLeft'), ArrowRight: msg('input:key.arrowRight'),
  ShiftLeft: msg('input:key.shiftLeft'), ShiftRight: msg('input:key.shiftRight'),
  ControlLeft: msg('input:key.controlLeft'), ControlRight: msg('input:key.controlRight'),
  AltLeft: msg('input:key.altLeft'), AltRight: msg('input:key.altRight'),
  Enter: msg('input:key.enter'), Space: msg('input:key.space'), Backspace: msg('input:key.backspace'),
  Tab: msg('input:key.tab'), Escape: msg('input:key.escape'), CapsLock: msg('input:key.capsLock'),
  PageUp: msg('input:key.pageUp'), PageDown: msg('input:key.pageDown'),
};

const MODIFIER_LABELS = {
  ctrl: msg('input:key.ctrl'),
  shift: msg('input:key.shift'),
  alt: msg('input:key.alt'),
} as const;

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

export { AXIS_FALLBACK_GLYPHS, KEY_CODE_GLYPHS, KEY_CODE_LABELS, MODIFIER_LABELS };
