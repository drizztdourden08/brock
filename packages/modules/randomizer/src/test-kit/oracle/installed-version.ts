/* @layer core @kind logic */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import type { ApworldRigConfig } from './apworld-rig.type';

const installedVersion = (config: ApworldRigConfig): string => {
  const manifest = JSON.parse(readFileSync(path.join(config.apDir, 'manifest.json'), 'utf8')) as { version: number[] };
  return manifest.version.join('.');
};

export { installedVersion };
