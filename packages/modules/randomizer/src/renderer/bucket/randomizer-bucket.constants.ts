/* @layer renderer-shell @kind constants */
import { msg } from '@drizztdourden08/brock-core/i18n';
import type { RandomizerLabels } from '../../contract/randomizer-labels.type';

const RANDOMIZER_BUCKET_ID = 'randomizer';

const DEFAULT_RANDOMIZER_LABELS: RandomizerLabels = {
  title: msg('randomizer:bucket.title'),
  run: msg('randomizer:label.run'),
  options: msg('randomizer:label.options'),
  logs: msg('randomizer:label.logs'),
  spoiler: msg('randomizer:label.spoiler'),
  checks: msg('randomizer:label.checks'),
  start: msg('randomizer:label.start'),
  stop: msg('randomizer:label.stop'),
};

const EXTRA_PAGES_META = { icon: 'network', empty: msg('randomizer:bucket.noExtraPages'), order: 7 } as const;

export { DEFAULT_RANDOMIZER_LABELS, EXTRA_PAGES_META, RANDOMIZER_BUCKET_ID };
