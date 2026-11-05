/* @layer renderer-shell @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'A small dialog anchored to an element that sets a whole number with a text field, step buttons, optional rungs and min and max shortcuts.',
  propsHash: '0000000000000000',
  useWhen: ['A cheats panel edits a count, a level or a capacity that has a range.'],
  avoidWhen: [{ case: 'A number in a settings form.', use: 'TextInput' }],
  rules: [
    'Pass min and max; every commit is rounded and clamped to them.',
    'Give steps for plus and minus buttons, or ladder for a fixed list of allowed values.',
    'Close it in onClose; it commits on Enter, on blur and on each button.',
  ],
  a11y: ['It is a dialog named by its title; the field names its range and Escape dismisses it.'],
  buildingBlock: true,
  example: `import { NumberSetter } from '@drizztdourden08/brock-react';

const Mounted = ({ anchor, onClose }: { anchor: HTMLElement | null; onClose: () => void }) => (
  <NumberSetter title="Bombs" value={5} min={0} max={99} steps={[1, 10]} anchor={anchor} onCommit={() => undefined} onClose={onClose} />
);
`,
} satisfies ComponentUsage;

export { usage };
