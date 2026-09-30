/* @layer tooling-scripts @kind config */
import { desktopReleaseJob } from '../../release/desktop-release-job.mjs';
import { definePlatform } from '../define-platform.mjs';
import { brandIcons } from '../desktop/brand-icons.mjs';
import { moduleChecks } from '../doctor/module-checks.mjs';
import { xcodeCheck } from '../doctor/xcode-check.mjs';

const macosPlatform = definePlatform({
  id: 'macos',
  label: 'macOS',
  doctor: [xcodeCheck(), moduleChecks('macos')],
  scaffold: [brandIcons()],
  releaseJob: desktopReleaseJob({
    platform: 'macos',
    runsOn: 'macos-latest',
    vpk: false,
    collect: ['release/*.dmg', 'release/*.zip'],
    downloads: [{ glob: 'artifacts/release-macos/*.dmg', label: 'macOS disk image (.dmg)' }],
  }),
});

export { macosPlatform };
