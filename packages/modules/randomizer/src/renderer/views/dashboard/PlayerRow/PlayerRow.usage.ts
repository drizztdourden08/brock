/* @layer renderer-shell @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'One row for a player of the room: name, game and an online dot with the status.',
  useWhen: [
    'A list of the players of an online room.',
  ],
  propsHash: '6ff32ef425c165b8',
  avoidWhen: [
    { case: 'A row that is not about a player.', use: 'Card' },
  ],
  rules: [
    'Pass player, a network player.',
    'The game shows in brackets when it is known.',
    'The dot is green when the player is online.',
  ],
  a11y: [
    'The status is written as text beside the dot, so colour is not the only signal.',
  ],
  example: `import { PlayerRow } from '@drizztdourden08/brock-randomizer/renderer';

import type { ComponentProps } from 'react';

const Row = ({ player }: ComponentProps<typeof PlayerRow>) => <PlayerRow player={player} />;
`,
  buildingBlock: true,
} satisfies ComponentUsage;

export { usage };
