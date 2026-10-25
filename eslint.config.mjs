/* @layer root-config @kind config */
import { brockEslint } from '@drizztdourden08/brock-lint-config';

export default brockEslint({
  primitivesGlobs: ['packages/modules/input/src/primitives/**/*.tsx'],
  inlineStyle: [
    {
      files: ['packages/react/src/brand/WindowMascot/sub-components/WalkerLayer.tsx'],
      why: 'The mascot follows live window and palette bounds, which change as either surface moves or resizes.',
    },
    {
      files: ['packages/modules/input/src/compounds/ControllerLayout/sub-components/ControllerTag.tsx'],
      why: 'Each tag sits at a position measured from the controller drawing, which no class can carry.',
    },
    {
      files: [
        'packages/modules/input/src/views/InputTester/sub-components/ControllerRawBytes.tsx',
        'packages/modules/input/src/views/InputTester/sub-components/hid-calibration/components/ByteChangeDot.tsx',
        'packages/modules/input/src/views/InputTester/sub-components/{input-cal-visuals,trigger-calibration/sub-components}/TriggerBar.tsx',
      ],
      why: 'Each raw byte cell is shaded by its live value, the change dot takes its position, width and colour from the size of the change, and a trigger bar fills to the live trigger value and marks the dead zone the user drags.',
    },
    {
      files: [
        'packages/modules/input/src/composites/PadOverlay/PadOverlay.tsx',
        'packages/modules/input/src/composites/PadOverlay/sub-components/OverlayHalo.tsx',
      ],
      why: 'The overlay grows to the size measured from the pad drawing, and each halo takes its glow level from the live input.',
    },
  ],
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
  defaultExportGlobs: ['packages/lint-config/markdown-rules.mjs', 'packages/build/src/knip-brock-dependencies.mjs'],
  ignores: ['templates/app/dist/**', 'templates/app/out/**', '**/.brock/**', 'packages/create-brock/template/**'],
});
