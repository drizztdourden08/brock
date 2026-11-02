/* @layer electron-main @kind logic */
import { join } from 'path';
import { RECOVERY_DIR } from './recovery-snapshots.constants';

const recoveryFolder = (profileFolder: string): string => join(profileFolder, RECOVERY_DIR);

export { recoveryFolder };
