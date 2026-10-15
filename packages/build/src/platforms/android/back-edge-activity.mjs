/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fillTemplate } from '../../release/fill-template.mjs';
import { androidAppId } from './android-app-id.mjs';
import {
  ANDROID_JAVA_DIR, ANDROID_MANIFEST_FILE, ANDROID_TEMPLATES, BACK_EDGE_EVENT, DEFAULT_MAIN_ACTIVITY, PREDICTIVE_BACK_ATTRIBUTE,
} from './android.constants.mjs';

const readText = (file) => readFileSync(file, 'utf8').replace(/\r\n/g, '\n');

const optIntoPredictiveBack = (rootDir) => {
  const file = join(rootDir, ANDROID_MANIFEST_FILE);
  if (!existsSync(file)) return;
  const manifest = readText(file);
  if (manifest.includes(PREDICTIVE_BACK_ATTRIBUTE)) return;
  writeFileSync(file, manifest.replace(/<application\b/, `<application\n        ${PREDICTIVE_BACK_ATTRIBUTE}="true"`), 'utf8');
};

/**
 * @returns {import('../platform.type.mjs').ScaffoldStep} a MainActivity that sends the back edge
 */
const backEdgeActivity = () => ({
  name: 'Back gesture edge in MainActivity',
  phase: 'tools',
  run: (ctx) => {
    const pkg = androidAppId(ctx.config.product);
    const relative = [ANDROID_JAVA_DIR, ...pkg.split('.'), 'MainActivity.java'].join('/');
    const file = join(ctx.rootDir, relative);
    if (!existsSync(file)) return { status: 'pending', detail: `needs ${relative} (cap add android) first` };
    const java = readText(file);
    if (java.includes(BACK_EDGE_EVENT)) return { status: 'skipped', detail: 'already hands the back edge over' };
    if (!DEFAULT_MAIN_ACTIVITY.test(java)) return { status: 'failed', detail: `${relative} has code of its own; dispatch "${BACK_EDGE_EVENT}" with the edge by hand (docs/architecture.md, Platforms)` };
    writeFileSync(file, fillTemplate(ANDROID_TEMPLATES, 'back-edge-activity.java.tmpl', { PACKAGE: pkg, EVENT: BACK_EDGE_EVENT }), 'utf8');
    optIntoPredictiveBack(ctx.rootDir);
    return { status: 'done', detail: relative };
  },
});

export { backEdgeActivity };
