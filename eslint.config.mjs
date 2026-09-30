/* @layer root-config @kind config */
import { brockEslint } from '@drizztdourden08/brock-lint-config';

export default brockEslint({
  rawColorOffGlobs: ['packages/electron/**', 'templates/app/electron/**'],
  doubleCast: [
    {
      files: ['packages/core/src/platform/detect.ts'],
      why: 'reads host globals (Capacitor, api) the code does not own; Window is not assignable to the probe shape',
    },
    {
      files: ['packages/core/src/platform/platform.ts'],
      why: 'ports are composed at runtime from the creators of an augmentation-point interface with no runtime schema',
    },
    {
      files: ['packages/electron/src/preload/build-invoke.ts', 'packages/electron/src/preload/build-send.ts', 'packages/electron/src/preload/build-events.ts', 'packages/electron/src/preload/create-preload-bridge.ts'],
      why: 'the IPC contract is composed from generic channel maps; a mapped generic type has no constructive form',
    },
  ],
  consoleGlobs: [
    'packages/build/**',
    'packages/create-brock/**',
    'packages/thread/**',
    'packages/plugins/**',
    'packages/modules/port-kit/bin/**',
    'packages/modules/input/bin/**',
    'packages/core/src/log/log-bus.ts',
    'packages/electron/src/main/bootstrap/boot-timing.ts',
    'packages/electron/src/main/bootstrap/create-main-context.ts',
    'packages/electron/src/main/logs/**',
    'packages/electron/src/preload/**',
  ],
  defaultExportGlobs: ['packages/lint-config/markdown-rules.mjs'],
  ignores: ['templates/app/dist/**', 'templates/app/out/**', '**/.brock/**', 'packages/create-brock/template/**'],
});
