/* @layer electron-main @kind logic */
import { BRIDGE_ACCEPTED_FILES_MAX } from './bridge.constants';
import { acceptedFiles } from './accepted-files';

const rememberAccepted = (file: string, stamp: string | null): void => {
  if (stamp === null) return;
  if (acceptedFiles.size >= BRIDGE_ACCEPTED_FILES_MAX) acceptedFiles.clear();
  acceptedFiles.set(file, stamp);
};

export { rememberAccepted };
