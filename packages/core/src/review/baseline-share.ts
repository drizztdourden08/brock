/* @layer core @kind logic */
import { PERCENT, PERCENT_DIGITS } from './baseline.constants';

const baselineShare = (share: number): string => `${(share * PERCENT).toFixed(PERCENT_DIGITS)}%`;

export { baselineShare };
