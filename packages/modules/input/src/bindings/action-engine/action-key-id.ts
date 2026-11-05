/* @layer core @kind logic */
import type { KeyboardBinding } from '../bindings.type';

const actionKeyId = (code: string, modifiers?: KeyboardBinding['modifiers']): string =>
  `${code}:${modifiers?.shift ? 1 : 0}:${modifiers?.ctrl ? 1 : 0}:${modifiers?.alt ? 1 : 0}`;

export { actionKeyId };
