/* @layer tooling-scripts @kind config */
import { desktopReleaseJob } from '../../release/desktop-release-job.mjs';
import { definePlatform } from '../define-platform.mjs';
import { brandIcons } from '../desktop/brand-icons.mjs';
import { dotnetCheck } from '../doctor/dotnet-check.mjs';
import { moduleChecks } from '../doctor/module-checks.mjs';
import { msvcCheck } from '../doctor/msvc-check.mjs';
import { vpkCheck } from '../doctor/vpk-check.mjs';

const windowsPlatform = definePlatform({
  id: 'windows',
  label: 'Windows',
  doctor: [dotnetCheck(['win32']), vpkCheck(['win32']), msvcCheck(), moduleChecks('windows')],
  scaffold: [brandIcons()],
  releaseJob: desktopReleaseJob({
    platform: 'windows',
    runsOn: 'windows-latest',
    vpk: true,
    collect: ['release/velopack/*'],
    downloads: [{
      glob: 'artifacts/release-windows/*-windows-setup.exe',
      label: 'Windows installer (.exe), a small download that installs and updates itself',
      latest: true,
      preview: { glob: 'artifacts/release-windows/*-windows-payload.exe', label: 'Windows setup (.exe) of this pre-release, which updates itself' },
    }],
  }),
});

export { windowsPlatform };
