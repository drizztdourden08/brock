/* @layer core @kind types */
type RandomizerLog = (msg: string, level?: 'info' | 'warn' | 'error') => void;

export type { RandomizerLog };
