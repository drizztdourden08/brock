/* @layer electron-main @kind logic */
import { autostartPath } from './autostart-path';
import { lureFile } from './lure-file';
import { repoConfigPath } from './repo-config-path';

const writeDenied = (real: string): boolean => autostartPath(real) || repoConfigPath(real) || lureFile(real);

export { writeDenied };
