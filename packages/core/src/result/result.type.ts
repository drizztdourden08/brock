/* @layer core @kind types */
type Result<T = void> = T extends void
  ? { success: true } | { success: false; error: string }
  : { success: true; value: T } | { success: false; error: string };

export type { Result };
