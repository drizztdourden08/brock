/* @layer renderer-shell @kind constants */
import { msg } from '@drizztdourden08/brock-core/i18n';
import type { Text } from '@drizztdourden08/brock-core/i18n';
import { MODE_LABELS } from '../LayerEditor/behavior/layer-ops.constants';
import type { PlayModeKind } from '../LayerEditor/behavior/layer-ops.type';
import type { LoopOrder } from './PlayModeFields.type';

const MODE_OPTIONS: { value: PlayModeKind; label: Text }[] = (Object.keys(MODE_LABELS) as PlayModeKind[])
  .map((kind) => ({ value: kind, label: MODE_LABELS[kind] }));

const MODE_HINTS: Record<PlayModeKind, Text> = {
  once: msg('msu:play.hint.once'),
  loop: msg('msu:play.hint.loop'),
  random: msg('msu:play.hint.random'),
  interval: msg('msu:play.hint.interval'),
};

const ORDER_OPTIONS: { value: LoopOrder; label: Text }[] = [
  { value: 'sequential', label: msg('msu:play.order.sequential') },
  { value: 'random', label: msg('msu:play.order.random') },
  { value: 'single', label: msg('msu:play.order.single') },
];

const ORDER_HINTS: Record<LoopOrder, Text> = {
  sequential: msg('msu:play.orderHint.sequential'),
  random: msg('msu:play.orderHint.random'),
  single: msg('msu:play.orderHint.single'),
};

const CROSSFADE_LABEL = msg('msu:play.crossfade');

const CROSSFADE_HINT = msg('msu:play.crossfadeHint');

const WAIT_LABEL = msg('msu:play.wait');

const WAIT_HINTS = {
  off: msg('msu:play.waitHint.off'),
  on: msg('msu:play.waitHint.on'),
};

export {
  MODE_OPTIONS, MODE_HINTS, ORDER_OPTIONS, ORDER_HINTS,
  CROSSFADE_LABEL, CROSSFADE_HINT, WAIT_LABEL, WAIT_HINTS,
};
