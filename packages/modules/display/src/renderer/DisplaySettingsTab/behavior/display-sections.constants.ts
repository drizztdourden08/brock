/* @layer renderer-shell @kind constants */
import type { DisplayRowId } from '../DisplaySettingsTab.type';

const WINDOW_ROWS: readonly DisplayRowId[] = ['windowMode', 'displayMonitor'];

const REFRESH_RATE_ROWS: readonly DisplayRowId[] = ['detectedRate', 'syncedRateInFullscreen', 'syncedRateTargetHz', 'changeRate'];

export { WINDOW_ROWS, REFRESH_RATE_ROWS };
