/* @layer tooling-scripts @kind logic */
import { copyFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { flag } from '../cli/thread-args.mjs';
import { buildApk } from './build-apk.mjs';
import { mobileConfig } from './mobile-config.mjs';
import { signingEnv } from './signing-env.mjs';

/**
 * @param {Record<string, string | boolean>} options release, out
 * @param {import('../workspace/workspace.type.mjs').ThreadContext} ctx
 */
const mobileBuild = (options, ctx) => {
  const release = flag(options, 'release');
  const config = mobileConfig(ctx.rootDir, ctx.workspace, { release });
  buildApk(config, ctx, release ? signingEnv(config.packageId, ctx.workspace.name) : process.env);
  const out = typeof options.out === 'string' ? resolve(options.out) : null;
  if (out) {
    mkdirSync(dirname(out), { recursive: true });
    copyFileSync(config.apk, out);
  }
  ctx.log(`APK: ${out ?? config.apk}`);
};

export { mobileBuild };
