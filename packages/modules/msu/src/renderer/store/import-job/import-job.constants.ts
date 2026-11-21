/* @layer renderer-shell @kind constants */
import { msg } from '@drizztdourden08/brock-core/i18n';
import type { Message } from '@drizztdourden08/brock-core/i18n';
import type { ImportKind, ImportPhase } from './import-job.type';

const PHASE_START: Record<ImportPhase, Message> = {
  download: msg('msu:import.start.download'),
  extract: msg('msu:import.start.extract'),
  copy: msg('msu:import.start.copy'),
  decode: msg('msu:import.start.decode'),
};

const PHASE_PLAIN: Record<ImportPhase, Message> = {
  download: msg('msu:import.plain.download'),
  extract: msg('msu:import.plain.extract'),
  copy: msg('msu:import.plain.copy'),
  decode: msg('msu:import.plain.decode'),
};

const PHASE_COUNT: Record<ImportPhase, (loaded: number, total: number) => Message> = {
  download: (loaded, total) => msg('msu:import.count.download', { loaded, total }),
  extract: (loaded, total) => msg('msu:import.count.extract', { loaded, total }),
  copy: (loaded, total) => msg('msu:import.count.copy', { loaded, total }),
  decode: (loaded, total) => msg('msu:import.count.decode', { loaded, total }),
};

const importJobId = (kind: ImportKind): string => `import:${kind}`;

export { importJobId, PHASE_COUNT, PHASE_PLAIN, PHASE_START };
