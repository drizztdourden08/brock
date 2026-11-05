/* @layer renderer-shell @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'A responsive row of small stat tiles, each with a label, a value, a tone and an optional meter.',
  useWhen: [
    'A dashboard that shows a few numbers at a glance, such as checks found or time played.',
  ],
  propsHash: '0000000000000000',
  avoidWhen: [
    { case: 'One number with a chart of its own.', use: 'Card' },
  ],
  rules: [
    'Pass tiles; each has label, value, tone and an optional meter with value and max.',
    'The label is the key, so keep labels unique.',
    'A meter draws a progress bar inside the tile.',
  ],
  a11y: [
    'The meter carries the tile label as its name.',
  ],
  example: `import { StatTiles } from './StatTiles';

import type { ComponentProps } from 'react';

const Tiles = ({ tiles }: ComponentProps<typeof StatTiles>) => <StatTiles tiles={tiles} />;
`,
  buildingBlock: true,
} satisfies ComponentUsage;

export { usage };
