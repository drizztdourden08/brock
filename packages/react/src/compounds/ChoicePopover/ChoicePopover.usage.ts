/* @layer renderer-shell @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'A small menu anchored to an element where the player picks one option, each with an optional sprite, tone and pick-all action.',
  useWhen: ['A cheats panel lets the player give, set or remove one thing from a short list.'],
  avoidWhen: [{ case: 'A menu of app commands.', use: 'ContextMenu' }],
  rules: [
    'Pass the element that opened it as anchor and close it in onClose; picking an option closes it for you.',
    'Give allLabel and an onPickAll on an option to show the pick-all button.',
  ],
  a11y: ['It is a menu named by its title; each option is a menu item, and Escape or an outside click dismisses it.'],
  buildingBlock: true,
  example: `import { ChoicePopover } from '@drizztdourden08/brock-react';

const Mounted = ({ anchor, onClose }: { anchor: HTMLElement | null; onClose: () => void }) => (
  <ChoicePopover title="Bottle" anchor={anchor} onClose={onClose} options={[{ key: 'a', label: 'Empty', onPick: () => undefined }]} />
);
`,
} satisfies ComponentUsage;

export { usage };
