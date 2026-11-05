/* @layer core @kind logic */
import { existsSync } from 'node:fs';
import type { ApworldRig, ApworldRigConfig } from './apworld-rig.type';
import { generatorPath } from './generator-path';
import { installWorldPackage } from './install-world-package';
import { installedVersion } from './installed-version';
import { runGeneration } from './run-generation';

const createApworldRig = (config: ApworldRigConfig): ApworldRig => {
  const hasArchipelago = (): boolean => existsSync(generatorPath(config));
  return {
    hasArchipelago,
    installedVersion: () => installedVersion(config),
    supportsInstalledVersion: () => hasArchipelago() && config.supportedVersions.includes(installedVersion(config)),
    installWorldPackage: () => installWorldPackage(config),
    generate: (yaml, seed, extra = []) => runGeneration(config, yaml, seed, extra),
  };
};

export { createApworldRig };
