/* @layer core @kind types */
import type { MemoryView } from './memory-view.type';

type FlagProbe =
  | { region: string; offset: number; width?: 1 | 2; mask: number }
  | { region: string; offset: number; width?: 1 | 2; compare: 'eq' | 'gte' | 'anyOf'; value: number | readonly number[] }
  | { custom(view: MemoryView): boolean };

export type { FlagProbe };
