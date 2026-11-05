/* @layer core @kind logic */
import { spawnSync } from 'node:child_process';
import { copyFileSync, existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import type { ApworldRigConfig } from './apworld-rig.type';
import { installedVersion } from './installed-version';

const installWorldPackage = (config: ApworldRigConfig): string => {
  const build = spawnSync(process.execPath, [config.buildScript], { encoding: 'utf8', cwd: config.root, windowsHide: true });
  if (build.status !== 0) throw new Error(`world package build failed: ${build.stderr}`);
  const version = installedVersion(config);
  const built = config.builtPackagePath(version);
  const target = path.join(config.apDir, 'custom_worlds', `${config.worldModuleName}.apworld`);
  const same = existsSync(target) && readFileSync(target).equals(readFileSync(built));
  if (same) return `world package already installed at ${target}`;
  copyFileSync(built, target);
  return `world package for Archipelago ${version} copied to ${target}`;
};

export { installWorldPackage };
