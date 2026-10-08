/* @layer electron-main @kind logic */
import { existsSync, readFileSync } from 'fs';
import { join, resolve } from 'path';
import type { AutomationFlags } from '@drizztdourden08/brock-core/automation';
import { BASELINE_CONFIG_FILE, BASELINE_DIR, parseBaselineConfig } from '@drizztdourden08/brock-core/review';
import type { BaselineOptions } from './baseline-options.type';
import { BASELINES_FLAG, BLESS_FLAG, PLATFORM_NAMES } from './review-baselines.constants';
import { wantsBaselines } from './wants-baselines';

const readConfig = (root: string): unknown => {
  const file = join(root, BASELINE_CONFIG_FILE);
  if (!existsSync(file)) return undefined;
  try {
    return JSON.parse(readFileSync(file, 'utf-8'));
  } catch (err) {
    throw new Error(`${file}: ${err instanceof Error ? err.message : String(err)}`, { cause: err });
  }
};

const readBaselineOptions = (flags: AutomationFlags, cwd = process.cwd(), argv?: readonly string[]): BaselineOptions | null => {
  if (!wantsBaselines(flags, argv)) return null;
  const root = resolve(cwd, flags.flagValue(BASELINES_FLAG, argv) ?? flags.flagValue(BLESS_FLAG, argv) ?? BASELINE_DIR);
  const platform = PLATFORM_NAMES[process.platform] ?? process.platform;
  return {
    mode: flags.hasFlag(BLESS_FLAG, argv) ? 'bless' : 'compare',
    root,
    setDir: join(root, platform),
    platform,
    config: parseBaselineConfig(readConfig(root)),
  };
};

export { readBaselineOptions };
