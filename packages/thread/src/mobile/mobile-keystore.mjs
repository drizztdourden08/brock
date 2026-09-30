/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';
import { ask } from './ask.mjs';
import { createKeystore } from './create-keystore.mjs';
import { keystorePaths } from './keystore-paths.mjs';
import { mobileConfig } from './mobile-config.mjs';
import { secretLines } from './secret-lines.mjs';

/**
 * @param {import('../workspace/workspace.type.mjs').ThreadContext} ctx
 * @returns {Promise<void>} makes the keystore only after a yes; never runs gh
 */
const mobileKeystore = async (ctx) => {
  const { packageId } = mobileConfig(ctx.rootDir, ctx.workspace);
  const paths = keystorePaths(packageId);
  if (existsSync(paths.keystore)) ctx.log(`Release keystore: ${paths.keystore}`);
  else {
    if (!process.stdin.isTTY) throw new Error(`No release keystore at ${paths.keystore}. Run this in a terminal: it asks before keytool writes one.`);
    if (!(await ask(`Create a release keystore for ${packageId} at ${paths.keystore} with keytool?`))) {
      ctx.log('No keystore made.');
      return;
    }
    createKeystore(paths, packageId);
    ctx.log(`Wrote ${paths.keystore}, its password in ${paths.password} and a base64 copy. Back up that folder: a lost key means a new app id on the store.`);
  }
  ctx.log('The release workflow reads three repository secrets. Run these yourself, from the repo, when you are ready:');
  for (const line of secretLines(paths, process.platform)) console.log(`  ${line}`);
};

export { mobileKeystore };
