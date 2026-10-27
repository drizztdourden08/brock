/* @layer electron-main @kind logic */
import type { JsonValue } from '@drizztdourden08/brock-core/ipc';
import { restartHandoffFile } from './restart-handoff-file';
import { takeHandoff } from './take-handoff';

const takeRestartHandoff = (): JsonValue | null => takeHandoff(restartHandoffFile());

export { takeRestartHandoff };
