/* @layer core @kind logic */
import type { FlagProbe } from './flag-probe.type';
import type { MemoryView } from './memory-view.type';
import { thresholdMet } from './threshold-met';

const probeMet = (probe: FlagProbe, view: MemoryView): boolean => {
  if ('custom' in probe) return probe.custom(view);
  const read = probe.width === 2 ? view.word(probe.region, probe.offset) : view.byte(probe.region, probe.offset);
  if ('mask' in probe) return (read & probe.mask) !== 0;
  return thresholdMet(read, probe.compare, probe.value);
};

export { probeMet };
