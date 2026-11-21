/* @layer renderer-shell @kind logic */
import { formatBytes } from '@drizztdourden08/brock-core';
import { msg } from '@drizztdourden08/brock-core/i18n';
import type { Message } from '@drizztdourden08/brock-core/i18n';
import { PHASE_COUNT, PHASE_PLAIN } from './import-job.constants';
import type { ImportPhase } from './import-job.type';

const importLine = (phase: ImportPhase, loaded: number, total?: number): Message => {
  if (phase === 'download') {
    const done = formatBytes(loaded);
    return total ? msg('msu:import.bytes', { loaded: done, total: formatBytes(total) }) : msg('msu:import.bytesOpen', { loaded: done });
  }
  return total === undefined ? PHASE_PLAIN[phase] : PHASE_COUNT[phase](loaded, total);
};

export { importLine };
