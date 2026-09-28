/* @layer renderer-shell @kind constants */
import type { SafeAreaInsets } from './safe-area-insets.type';

const SAFE_AREA_EVENT = 'safeareainsets';

const ZERO: SafeAreaInsets = { top: 0, right: 0, bottom: 0, left: 0, hasNotch: false };

export { SAFE_AREA_EVENT, ZERO };
