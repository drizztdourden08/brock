/* @layer renderer-shell @kind logic */
import { hostApi } from '../../host/host-api';
import type { WakeSource } from './wake.type';

const windowWake: WakeSource = (wake) => hostApi()?.onReviewWindows(wake) ?? (() => undefined);

export { windowWake };
