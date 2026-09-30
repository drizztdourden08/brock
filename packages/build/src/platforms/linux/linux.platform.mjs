/* @layer tooling-scripts @kind config */
import { desktopReleaseJob } from '../../release/desktop-release-job.mjs';
import { definePlatform } from '../define-platform.mjs';
import { brandIcons } from '../desktop/brand-icons.mjs';
import { dotnetCheck } from '../doctor/dotnet-check.mjs';
import { moduleChecks } from '../doctor/module-checks.mjs';
import { vpkCheck } from '../doctor/vpk-check.mjs';
import { debPostinst } from './deb-postinst.mjs';

const linuxPlatform = definePlatform({
  id: 'linux',
  label: 'Linux',
  doctor: [dotnetCheck(['linux']), vpkCheck(['linux']), moduleChecks('linux')],
  scaffold: [brandIcons()],
  managed: debPostinst,
  releaseJob: desktopReleaseJob({
    platform: 'linux',
    runsOn: 'ubuntu-latest',
    vpk: true,
    collect: ['release/velopack/*', 'release/*.deb'],
    downloads: [
      { glob: 'artifacts/release-linux/*.AppImage', label: 'Linux AppImage, updates itself' },
      { glob: 'artifacts/release-linux/*.deb', label: 'Debian package (.deb)' },
    ],
  }),
});

export { linuxPlatform };
