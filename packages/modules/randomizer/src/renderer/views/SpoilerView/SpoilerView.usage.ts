/* @layer renderer-shell @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'The spoiler page: the game spoiler view, the checks list, or a plain list of placements.',
  useWhen: [
    'A page that shows where things were placed in the seed.',
  ],
  propsHash: '0000000000000000',
  avoidWhen: [
    { case: 'A list of the checks the player has found.', use: 'Card' },
  ],
  rules: [
    'It takes no props; it reads the active game and session.',
    'A game can replace it with its own Spoiler view.',
    'With a tracker it shows the checks list, otherwise the placement rows.',
  ],
  a11y: [
    'Rows are label and value text, and the empty state is plain text.',
  ],
  example: `import { SpoilerView } from './SpoilerView';

const Spoiler = () => <SpoilerView />;
`,
  buildingBlock: true,
} satisfies ComponentUsage;

export { usage };
