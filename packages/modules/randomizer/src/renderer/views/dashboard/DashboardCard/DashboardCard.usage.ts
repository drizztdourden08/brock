/* @layer renderer-shell @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'A card cell for the dashboard grid with a title, an optional subtitle and actions.',
  useWhen: [
    'A dashboard or run page lays out panels in a grid.',
  ],
  propsHash: 'cdc3f1d4d9d65661',
  avoidWhen: [
    { case: 'A card that is not inside a dashboard grid.', use: 'Card' },
  ],
  rules: [
    'Pass span as 1, 2 or full to set how many columns the cell takes.',
    'Put the panel body in children.',
    'Use it inside a Grid only.',
  ],
  a11y: [
    'The title is the card heading.',
  ],
  example: `import { DashboardCard } from '@drizztdourden08/brock-randomizer/renderer';

const Panel = () => <DashboardCard span={2} title="Progress">12 of 40 checks</DashboardCard>;
`,
  buildingBlock: true,
} satisfies ComponentUsage;

export { usage };
