/* @layer electron-main @kind logic */
import { randomBytes } from 'crypto';
import { mkdirSync, renameSync, rmSync, writeFileSync } from 'fs';
import { dirname } from 'path';
import type { BridgeDiscovery } from './bridge.type';
import { BRIDGE_DIR_MODE, BRIDGE_FILE_MODE } from './bridge.constants';

const writeDiscovery = (file: string, discovery: BridgeDiscovery): void => {
  mkdirSync(dirname(file), { recursive: true, mode: BRIDGE_DIR_MODE });
  const partial = `${file}.${randomBytes(8).toString('hex')}.tmp`;
  try {
    writeFileSync(partial, JSON.stringify(discovery), { mode: BRIDGE_FILE_MODE, flag: 'wx' });
    renameSync(partial, file);
  } catch (error) {
    rmSync(partial, { force: true });
    throw error;
  }
};

export { writeDiscovery };
