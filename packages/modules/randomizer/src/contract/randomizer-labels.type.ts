/* @layer core @kind types */
import type { RandomizerModeId } from '../augment';

interface RandomizerLabels {
  title: string;
  run: string;
  options: string;
  logs: string;
  spoiler: string;
  checks: string;
  start: string;
  stop: string;
  modes?: Partial<Record<RandomizerModeId, string>>;
  counters?: Record<string, string>;
  events?: string;
  kinds?: Record<string, string>;
}

export type { RandomizerLabels };
