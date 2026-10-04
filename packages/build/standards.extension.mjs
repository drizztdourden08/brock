/* @layer tooling-scripts @kind config */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { defineExtension } from '@drizztdourden08/standards';
import { checkInstallerFolder } from './src/installer/check-installer-folder.mjs';
import { checkScreens } from './src/screens/check-screens.mjs';
import { scanScreens } from './src/screens/scan-screens.mjs';
import { SCREENS_CONFIG, SCREENS_DIR } from './src/screens/screen-conventions.constants.mjs';
import { customPageCounts } from './src/screens/search/custom-page-counts.mjs';
import { checkWidgets } from './src/widgets/check-widgets.mjs';
import { WIDGETS_DIR } from './src/widgets/widget-conventions.constants.mjs';
import { checkTitleBar } from './src/title-bar/check-title-bar.mjs';
import { TITLE_BAR_DIR } from './src/title-bar/title-bar-conventions.constants.mjs';

const APP_MARKER = 'brock.config.ts';

const hasScreens = (dir) => existsSync(join(dir, SCREENS_DIR, SCREENS_CONFIG));

const isApp = (dir) => existsSync(join(dir, APP_MARKER));

const hasWidgets = (dir) => isApp(dir) && existsSync(join(dir, WIDGETS_DIR));

const hasTitleBar = (dir) => isApp(dir) && existsSync(join(dir, TITLE_BAR_DIR));

const conventionOwned = (dir) => [
  ...(hasScreens(dir) ? [join(dir, SCREENS_DIR)] : []),
  ...(hasWidgets(dir) ? [join(dir, WIDGETS_DIR)] : []),
  ...(hasTitleBar(dir) ? [join(dir, TITLE_BAR_DIR)] : []),
];

const customPageNote = (dir, label) => {
  if (!hasScreens(dir)) return [];
  const { files, buckets } = scanScreens(dir);
  return [`${label}: custom pages per bucket: ${customPageCounts(files, buckets) || 'no buckets'}`];
};

const brockAppChecks = async ({ rootDir, packageDir, label, kind }) => {
  const prefix = label === '.' ? '' : `${label}/`;
  const screens = (await checkScreens(packageDir)).map((finding) => `${prefix}${finding}`);
  const widgets = hasWidgets(packageDir) ? checkWidgets(packageDir).map((finding) => `${prefix}${finding}`) : [];
  const titleBar = hasTitleBar(packageDir) ? checkTitleBar(packageDir).map((finding) => `${prefix}${finding}`) : [];
  return {
    findings: [...(kind === 'app' ? checkInstallerFolder(rootDir, packageDir) : []), ...screens, ...widgets, ...titleBar],
    notes: customPageNote(packageDir, label),
  };
};

export default defineExtension({
  id: 'brock-app',
  description: 'Brock apps: brock.config.ts marks an app, src/screens, src/widgets, src/title-bar and build/installer have their own checks, <id>.task.ts boot tasks, <id>.widget.tsx widget files and <id>.action.ts title bar items',
  structure: {
    appMarkers: [APP_MARKER],
    moduleFiles: [{ pattern: /^[a-z][a-z0-9-]*\.task\.ts$/, label: '<id>.task.ts' }, { pattern: /^[a-z][a-z0-9-]*\.widget\.tsx$/, label: '<id>.widget.tsx' },
      { pattern: /^[a-z][a-z0-9-]*\.action\.ts$/, label: '<id>.action.ts' },
    ],
    ownedDirs: conventionOwned,
    checks: [brockAppChecks],
  },
});
