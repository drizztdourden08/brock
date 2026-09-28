/* @layer renderer-shell @kind constants */
import type { RefreshRateInfo } from '../display.type';

const WARMUP_FRAMES = 5;

const SAMPLE_FRAMES = 40;

const SWITCH_SETTLE_MS = 1200;

const EMPTY_REFRESH_RATE: RefreshRateInfo = { reportedHz: null, measuredHz: null, modes: [] };

export { WARMUP_FRAMES, SAMPLE_FRAMES, SWITCH_SETTLE_MS, EMPTY_REFRESH_RATE };
