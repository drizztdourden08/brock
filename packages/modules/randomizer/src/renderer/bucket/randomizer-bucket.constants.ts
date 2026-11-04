/* @layer renderer-shell @kind constants */
import type { RandomizerLabels } from '../../contract/randomizer-labels.type';

const RANDOMIZER_BUCKET_ID = 'randomizer';

const DEFAULT_RANDOMIZER_LABELS: RandomizerLabels = {
  title: 'Randomizer',
  run: 'Run',
  options: 'Options',
  logs: 'Logs',
  spoiler: 'Spoiler',
  start: 'Start',
  stop: 'Stop',
};

const EXTRA_PAGES_META = { icon: 'network', empty: 'No extra pages', order: 3 } as const;

export { DEFAULT_RANDOMIZER_LABELS, EXTRA_PAGES_META, RANDOMIZER_BUCKET_ID };
