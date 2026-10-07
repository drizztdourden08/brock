/* @layer tooling-scripts @kind config */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { defineExtension } from '@drizztdourden08/standards';
import { checkInstallerFolder } from './src/installer/check-installer-folder.mjs';
import { checkScreens } from './src/screens/check-screens.mjs';
import { scanScreens } from './src/screens/scan-screens.mjs';
import { SCREENS_CONFIG, SCREENS_DIR } from './src/screens/screen-conventions.constants.mjs';
import { customPageCounts } from './src/screens/search/custom-page-counts.mjs';
import { nodeBarrelNotes } from './src/renderer-imports/node-barrel-notes.mjs';
import { checkWidgets } from './src/widgets/check-widgets.mjs';
import { WIDGETS_DIR } from './src/widgets/widget-conventions.constants.mjs';
import { checkTitleBar } from './src/title-bar/check-title-bar.mjs';
import { TITLE_BAR_DIR } from './src/title-bar/title-bar-conventions.constants.mjs';
import { checkTours } from './src/tours/check-tours.mjs';
import { TOURS_DIR } from './src/tours/tour-conventions.constants.mjs';

const APP_MARKER = 'brock.config.ts';

const hasScreens = (dir) => existsSync(join(dir, SCREENS_DIR, SCREENS_CONFIG));

const isApp = (dir) => existsSync(join(dir, APP_MARKER));

const hasWidgets = (dir) => isApp(dir) && existsSync(join(dir, WIDGETS_DIR));

const hasTitleBar = (dir) => isApp(dir) && existsSync(join(dir, TITLE_BAR_DIR));

const hasTours = (dir) => isApp(dir) && existsSync(join(dir, TOURS_DIR));

const REVIEW_FIXTURES_DIR = 'src/review/fixtures';

const conventionOwned = (dir) => [
  ...(hasScreens(dir) ? [join(dir, SCREENS_DIR)] : []),
  ...(hasWidgets(dir) ? [join(dir, WIDGETS_DIR)] : []),
  ...(hasTitleBar(dir) ? [join(dir, TITLE_BAR_DIR)] : []),
  ...(hasTours(dir) ? [join(dir, TOURS_DIR)] : []),
  join(dir, REVIEW_FIXTURES_DIR),
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
  const tourFindings = hasTours(packageDir) ? checkTours(packageDir).map((finding) => `${prefix}${finding}`) : [];
  return {
    findings: [...(kind === 'app' ? checkInstallerFolder(rootDir, packageDir) : []), ...screens, ...widgets, ...titleBar, ...tourFindings],
    notes: [...customPageNote(packageDir, label), ...(isApp(packageDir) ? nodeBarrelNotes(packageDir, prefix) : [])],
  };
};

export default defineExtension({
  id: 'brock-app',
  description: 'Brock apps: brock.config.ts marks an app, src/screens, src/widgets, src/title-bar, src/tours and build/installer have their own checks, <id>.task.ts boot tasks, <id>.widget.tsx widget files, <id>.step.ts review steps, <id>.action.ts title bar items and <id>.tour.ts tours, each with its <id>.<kind>.constants.ts',
  structure: {
    appMarkers: [APP_MARKER],
    moduleFiles: [
      { pattern: /^[a-z][a-z0-9-]*\.task\.ts$/, label: '<id>.task.ts' },
      { pattern: /^[a-z][a-z0-9-]*\.widget\.tsx$/, label: '<id>.widget.tsx' },
      { pattern: /^[a-z][a-z0-9-]*\.step\.ts$/, label: '<id>.step.ts' },
      { pattern: /^[a-z][a-z0-9-]*\.action\.ts$/, label: '<id>.action.ts' },
      { pattern: /^[a-z][a-z0-9-]*\.tour\.ts$/, label: '<id>.tour.ts' },
      { pattern: /^[a-z][a-z0-9-]*\.(?:task|widget|step|action|tour)\.constants\.ts$/, label: '<id>.<kind>.constants.ts' },
    ],
    ownedDirs: conventionOwned,
    checks: [brockAppChecks],
  },
});
