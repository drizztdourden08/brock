/* @layer tooling-scripts @kind logic */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { runPlatformPhase, writeTargets } from '@drizztdourden08/brock-build';
import { sayLines } from './say-lines.mjs';

/**
 * @param {string} targetDir
 * @param {import('@drizztdourden08/brock-build/config').BrockConfig} config product, targets and modules as scaffolded
 * @returns {Promise<void>} targets written, then the file-only platform steps
 */
const preparePlatforms = async (targetDir, config) => {
  const file = join(targetDir, 'brock.config.ts');
  writeFileSync(file, writeTargets(readFileSync(file, 'utf8'), config.targets), 'utf8');
  const files = await runPlatformPhase({ rootDir: targetDir, config, phase: 'files' });
  sayLines(`platform files for ${config.targets.join(', ')}`, files.lines);
};

export { preparePlatforms };
