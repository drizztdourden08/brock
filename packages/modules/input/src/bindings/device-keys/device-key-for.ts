/* @layer core @kind logic */
import { ANY_DEVICE } from '../bindings.constants';
import { padHex } from './pad-hex';

const deviceKeyFor = (sourceVid?: string | null, sourcePid?: string | null): string =>
  sourceVid && sourcePid ? `${padHex(sourceVid)}:${padHex(sourcePid)}` : ANY_DEVICE;

export { deviceKeyFor };
