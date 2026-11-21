/* @layer renderer-shell @kind constants */
import { msg } from '@drizztdourden08/brock-core/i18n';
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { LayerPlayMode } from '../../../../types';
import type { PlayModeKind } from './layer-ops.type';

const DEFAULT_CROSSFADE_SECONDS = 0;
const DEFAULT_WAIT_FOR_COMPLETION = false;

const DEFAULT_MODES: Record<PlayModeKind, LayerPlayMode> = {
  once: { kind: 'once' },
  loop: { kind: 'loop', order: 'sequential', crossfadeSeconds: DEFAULT_CROSSFADE_SECONDS },
  random: {
    kind: 'random',
    minDelaySeconds: 10,
    maxDelaySeconds: 30,
    waitForCompletion: DEFAULT_WAIT_FOR_COMPLETION,
  },
  interval: { kind: 'interval', atSeconds: [] },
};

const MODE_LABELS: Record<PlayModeKind, Text> = {
  once: msg('msu:play.mode.once'), loop: msg('msu:play.mode.loop'), random: msg('msu:play.mode.random'), interval: msg('msu:play.mode.interval'),
};

export { DEFAULT_CROSSFADE_SECONDS, DEFAULT_MODES, MODE_LABELS };
