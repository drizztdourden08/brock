/* @layer core @kind logic */
import type { BaselineResult } from './baseline.type';

const isBaselineFailure = (result: BaselineResult): boolean => result.status !== 'match' && result.status !== 'blessed';

export { isBaselineFailure };
