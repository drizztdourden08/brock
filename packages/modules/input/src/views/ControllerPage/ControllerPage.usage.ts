/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'The page of one connected controller: its live picture, sticks and triggers, buttons, and facts in four boxes.',
  useWhen: ['As the page of one pad in the controllers area, with the device key of that pad.'],
  avoidWhen: [{ case: 'A short list of facts about one controller.', use: 'FactsPanel' }],
  rules: [
    'Mount it through padLivePages: one live hub page per connected pad, keyed by its device key.',
    'The page reads its own state and shows a notice when the pad is gone.',
    'Run diagnostics and the buttons an app adds with registerDeviceCardActions sit in the header of the Controller box.',
    'An app adds rumble tests with registerRumbleTests and the button glyph images with registerGlyphSource; without a glyph source the pad shows no glyph images.',
  ],
  a11y: ['The pad picture is a labelled figure that lists the inputs held down as text.'],
  buildingBlock: true,
  example: `import { padLivePages } from '@drizztdourden08/brock-input/renderer';

const pages = padLivePages([]);
`,
  propsHash: '5946f8e0f66ab3a1',
} satisfies ComponentUsage;

export { usage };
