/* @layer core @kind types */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { RandomizerModeId } from '../augment';

interface RandomizerLabels {
  title: Text;
  run: Text;
  options: Text;
  logs: Text;
  spoiler: Text;
  checks: Text;
  start: Text;
  stop: Text;
  modes?: Partial<Record<RandomizerModeId, Text>>;
  counters?: Record<string, string>;
  events?: Text;
  kinds?: Record<string, Text>;
}

export type { RandomizerLabels };
