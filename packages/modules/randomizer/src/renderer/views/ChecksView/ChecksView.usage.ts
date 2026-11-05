/* @layer renderer-shell @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'The list of every check of the game, grouped, filtered and searchable, with the state of each.',
  useWhen: [
    'A page that shows what the player has found and what is left in a randomized game.',
  ],
  propsHash: '0000000000000000',
  avoidWhen: [
    { case: 'A plain list of rows with no grouping or filters.', use: 'Card' },
  ],
  rules: [
    'It reads the tracker of the active game; with no tracker it shows an empty message.',
    'Pass prefKey to keep the filters and the view mode between visits.',
    'Pass initial to set the first grouping, filter or view mode.',
  ],
  a11y: [
    'Search and filters are labelled controls, and the empty states are plain text.',
  ],
  example: `import { ChecksView } from '@drizztdourden08/brock-randomizer/renderer';

const Checks = () => <ChecksView prefKey="checks" />;
`,
  buildingBlock: true,
} satisfies ComponentUsage;

export { usage };
