/* @layer renderer-shell @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'The online page: server setup, connection, health, progress, players and server details as a grid of panels.',
  useWhen: [
    'A page that shows the state of the Archipelago connection.',
  ],
  propsHash: '0000000000000000',
  avoidWhen: [
    { case: 'One small status line.', use: 'Card' },
  ],
  rules: [
    'It takes no props; it reads the network status.',
    'With no status it shows the setup panel and an empty message.',
    'Panels reflow with the width of the page.',
  ],
  a11y: [
    'Each panel is a titled card and the empty state is plain text.',
  ],
  example: `import { NetworkView } from '@drizztdourden08/brock-randomizer/renderer';

const Network = () => <NetworkView />;
`,
  buildingBlock: true,
} satisfies ComponentUsage;

export { usage };
