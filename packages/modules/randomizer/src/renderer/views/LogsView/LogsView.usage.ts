/* @layer renderer-shell @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'The activity log of the run: game events and room chat, searchable, with a box to say something to the room.',
  useWhen: [
    'A page that shows what happened during the run and lets an online player chat.',
  ],
  propsHash: '0000000000000000',
  avoidWhen: [
    { case: 'A log of the app itself, not the run.', use: 'Card' },
  ],
  rules: [
    'It takes no props; it reads the log and the room messages.',
    'The say box is disabled when no room is joined.',
    'Search and kind filters come from the game rules.',
  ],
  a11y: [
    'The search and the say box are labelled inputs.',
  ],
  example: `import { LogsView } from './LogsView';

const Logs = () => <LogsView />;
`,
  buildingBlock: true,
} satisfies ComponentUsage;

export { usage };
