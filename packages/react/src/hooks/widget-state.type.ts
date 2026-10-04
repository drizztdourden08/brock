/* @layer renderer-shell @kind types */
type WidgetStateUpdate<T> = T | ((prev: T) => T);

export type { WidgetStateUpdate };
