/* @layer electron-main @kind logic */
import { getLegacyPath } from '../paths/get-legacy-path';
import { HANDOFF_FILE } from './restart.constants';

const restartHandoffFile = (): string => getLegacyPath(HANDOFF_FILE);

export { restartHandoffFile };
