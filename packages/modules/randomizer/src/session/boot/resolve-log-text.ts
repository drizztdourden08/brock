/* @layer core @kind logic */
import type { RandomizerLogText } from '../../contract/randomizer-log-text.type';
import { DEFAULT_LOG_TEXT } from './log-text.constants';

const resolveLogText = (overrides?: Partial<RandomizerLogText>): RandomizerLogText => ({
  ...DEFAULT_LOG_TEXT,
  ...overrides,
});

export { resolveLogText };
