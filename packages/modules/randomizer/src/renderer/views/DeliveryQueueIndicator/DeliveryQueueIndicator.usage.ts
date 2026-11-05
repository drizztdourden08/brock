/* @layer renderer-shell @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'A card that lists the items waiting to reach the player, with the one being delivered shown first.',
  useWhen: [
    'The play screen of an online game, so the player sees what is coming in.',
  ],
  propsHash: '0a5364a8de325c6b',
  avoidWhen: [
    { case: 'A message the player must answer.', use: 'Dialog' },
  ],
  rules: [
    'It renders nothing when the queue is empty.',
    'maxVisible caps the lines; the rest show as a count.',
    'Pass title to rename the card.',
  ],
  a11y: [
    'The card has a title and a count, and the overflow is plain text.',
  ],
  example: `import { DeliveryQueueIndicator } from './DeliveryQueueIndicator';

const Mounted = () => <DeliveryQueueIndicator maxVisible={5} />;
`,
  buildingBlock: true,
} satisfies ComponentUsage;

export { usage };
