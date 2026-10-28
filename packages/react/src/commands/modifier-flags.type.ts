/* @layer renderer-shell @kind types */
type ModifierFlags = Pick<KeyboardEvent, 'ctrlKey' | 'altKey' | 'shiftKey' | 'metaKey'>;

export type { ModifierFlags };
