/* @layer renderer-shell @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'A grid that lists the keys and mouse buttons of a panel, each drawn as a shortcut glyph with its meaning.',
  propsHash: '0000000000000000',
  useWhen: ['At the foot of a cheats or tools panel that is driven by keys, clicks and the wheel.'],
  avoidWhen: [{ case: 'The full list of app shortcuts.', use: 'ShortcutList' }],
  rules: ['Give each item a glyph of key, mouse-left, mouse-right or wheel; a key item also needs its keyName.'],
  a11y: ['The grid is a list named Controls, or the label you pass.'],
  buildingBlock: true,
  example: `import { ControlLegend } from '@drizztdourden08/brock-react';

const Mounted = () => <ControlLegend items={[{ glyph: 'mouse-left', label: 'Pick' }, { glyph: 'wheel', label: 'Adjust' }]} />;
`,
} satisfies ComponentUsage;

export { usage };
