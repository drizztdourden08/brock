/* @layer renderer-shell @kind types */
type WidgetStateUpdate<T> = T | ((prev: T) => T);

interface WidgetStateOptions {
  scope?: string;
}

export type { WidgetStateOptions, WidgetStateUpdate };
