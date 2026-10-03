/* @layer tooling-scripts @kind config */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { defineExtension } from '@drizztdourden08/standards';
import { checkInstallerFolder } from './src/installer/check-installer-folder.mjs';
import { checkScreens } from './src/screens/check-screens.mjs';
import { scanScreens } from './src/screens/scan-screens.mjs';
import { SCREENS_CONFIG, SCREENS_DIR } from './src/screens/screen-conventions.constants.mjs';
import { customPageCounts } from './src/screens/search/custom-page-counts.mjs';

const APP_MARKER = 'brock.config.ts';

const hasScreens = (dir) => existsSync(join(dir, SCREENS_DIR, SCREENS_CONFIG));

const screensOwned = (dir) => (hasScreens(dir) ? [join(dir, SCREENS_DIR)] : []);

const customPageNote = (dir, label) => {
  if (!hasScreens(dir)) return [];
  const { files, buckets } = scanScreens(dir);
  return [`${label}: custom pages per bucket: ${customPageCounts(files, buckets) || 'no buckets'}`];
};

const brockAppChecks = async ({ rootDir, packageDir, label, kind }) => {
  const prefix = label === '.' ? '' : `${label}/`;
  const screens = (await checkScreens(packageDir)).map((finding) => `${prefix}${finding}`);
  return {
    findings: [...(kind === 'app' ? checkInstallerFolder(rootDir, packageDir) : []), ...screens],
    notes: customPageNote(packageDir, label),
  };
};

export default defineExtension({
  id: 'brock-app',
  description: 'Brock apps: brock.config.ts marks an app, src/screens and build/installer have their own checks, <id>.task.ts boot tasks',
  structure: {
    appMarkers: [APP_MARKER],
    moduleFiles: [{ pattern: /^[a-z][a-z0-9-]*\.task\.ts$/, label: '<id>.task.ts' }],
    ownedDirs: screensOwned,
    checks: [brockAppChecks],
  },
});
