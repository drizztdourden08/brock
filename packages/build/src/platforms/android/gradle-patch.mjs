/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { APP_GRADLE_FILE } from './android.constants.mjs';

/**
 * @param {{ name: string, marker: string, patch: (gradle: string) => string | null }} spec
 * @returns {import('../platform.type.mjs').ScaffoldStep} an idempotent edit of mobile/android/app/build.gradle
 */
const gradlePatch = ({ name, marker, patch }) => ({
  name,
  phase: 'tools',
  run: (ctx) => {
    const file = join(ctx.rootDir, APP_GRADLE_FILE);
    if (!existsSync(file)) return { status: 'pending', detail: `needs ${APP_GRADLE_FILE} (cap add android) first` };
    const gradle = readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
    if (gradle.includes(marker)) return { status: 'skipped', detail: 'already patched' };
    const next = patch(gradle);
    if (next === null) return { status: 'failed', detail: `${APP_GRADLE_FILE} does not have the Capacitor layout; edit it by hand` };
    writeFileSync(file, next, 'utf8');
    return { status: 'done', detail: APP_GRADLE_FILE };
  },
});

export { gradlePatch };
