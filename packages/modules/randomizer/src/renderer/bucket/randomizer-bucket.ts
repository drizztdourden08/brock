/* @layer renderer-shell @kind config */
import { lazyComponent } from '@drizztdourden08/brock-react';
import type { ModuleBucket } from '@drizztdourden08/brock-react';
import { useRandomizerGameStore } from '../game-registry/behavior/useRandomizerGameStore';
import { meta as networkMeta } from '../../screens/archipelago/network.page';
import { meta as onlineMeta } from '../../screens/archipelago/online.page';
import { meta as logsMeta } from '../../screens/logs.page';
import { meta as optionsMeta } from '../../screens/options.page';
import { meta as runMeta } from '../../screens/run.page';
import { meta as spoilerMeta } from '../../screens/spoiler.page';
import { useExtraPages } from './behavior/useExtraPages';
import { DEFAULT_RANDOMIZER_LABELS, EXTRA_PAGES_META, RANDOMIZER_BUCKET_ID } from './randomizer-bucket.constants';

const bucket = RANDOMIZER_BUCKET_ID;

const randomizerBucket: ModuleBucket = {
  bucket: {
    id: bucket,
    title: DEFAULT_RANDOMIZER_LABELS.title,
    icon: 'sparkles',
    menu: 'entry',
    when: ({ profile }) => profile?.randomizer !== undefined && useRandomizerGameStore.getState().game !== null,
  },
  entries: [
    { kind: 'page', bucket, id: 'run', component: lazyComponent(() => import('../../screens/run.page')), meta: runMeta },
    { kind: 'page', bucket, id: 'options', component: lazyComponent(() => import('../../screens/options.page')), meta: optionsMeta },
    { kind: 'page', bucket, id: 'network', component: lazyComponent(() => import('../../screens/archipelago/network.page')), meta: networkMeta },
    { kind: 'page', bucket, id: 'online', component: lazyComponent(() => import('../../screens/archipelago/online.page')), meta: onlineMeta },
    { kind: 'live', bucket, id: 'extra', usePages: useExtraPages, meta: EXTRA_PAGES_META },
    { kind: 'page', bucket, id: 'logs', component: lazyComponent(() => import('../../screens/logs.page')), meta: logsMeta },
    { kind: 'page', bucket, id: 'spoiler', component: lazyComponent(() => import('../../screens/spoiler.page')), meta: spoilerMeta },
  ],
};

export { randomizerBucket };
