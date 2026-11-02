/* @layer electron-main @kind logic */
import { join } from 'path';
import { profileDir } from '@drizztdourden08/brock-core/storage';
import { recoveryFolder } from '../main/documents/recovery-folder';
import { dataRootOf } from '../main/paths/data-root-of';

const recoveryDir = (userDataDir: string, profileId: string): string => recoveryFolder(join(dataRootOf(userDataDir), profileDir(profileId)));

export { recoveryDir };
