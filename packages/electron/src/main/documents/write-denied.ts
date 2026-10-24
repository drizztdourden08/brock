/* @layer electron-main @kind logic */
import { autostartPath } from './autostart-path';
import { bareRepoLayout } from './bare-repo-layout';
import { lureFile } from './lure-file';
import { repoConfigPath } from './repo-config-path';

const writeDenied = async (real: string): Promise<boolean> =>
  autostartPath(real) || repoConfigPath(real) || lureFile(real) || (await bareRepoLayout(real));

export { writeDenied };
