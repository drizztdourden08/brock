/* @layer renderer-shell @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'The online settings page: death link and tracking of other players, plus any panel the game adds.',
  useWhen: [
    'A page where the player sets how the run behaves online.',
  ],
  propsHash: '0000000000000000',
  avoidWhen: [
    { case: 'A single on or off setting with no card.', use: 'Field' },
  ],
  rules: [
    'It takes no props; it reads the connection of the active game.',
    'A toggle writes its change at once.',
    'The game can add its own Online view below the toggles.',
  ],
  a11y: [
    'Each toggle has a label and a description.',
  ],
  example: `import { OnlineView } from '@drizztdourden08/brock-randomizer/renderer';

const Online = () => <OnlineView />;
`,
  buildingBlock: true,
} satisfies ComponentUsage;

export { usage };
