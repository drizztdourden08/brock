/* @layer core @kind logic */
import { BASE_HZ } from './rates.constants';

const nearestMultiple = (hz: number): number => Math.max(1, Math.round(hz / BASE_HZ));

export { nearestMultiple };
