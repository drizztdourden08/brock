/* @layer renderer-shell @kind logic */
import type { ControllerBusType } from '../../../../device.type';
import type { ConnectionHint } from './hid-calibration.type';

const guessConnectionHint = (busType: ControllerBusType | null | undefined): ConnectionHint => busType ?? 'unknown';

export { guessConnectionHint };
