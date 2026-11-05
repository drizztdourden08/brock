/* @layer renderer-shell @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'The run page: summary, progress, recent activity, players, settings and any panel the game adds, in one grid.',
  useWhen: [
    'The home page of a randomizer profile.',
  ],
  propsHash: '69a6789bb8733db8',
  avoidWhen: [
    { case: 'A page of unrelated settings.', use: 'Card' },
  ],
  rules: [
    'It takes no props; it reads the active profile and game.',
    'The players panel shows only for online profiles.',
    'A game adds panels through its run panels list.',
  ],
  a11y: [
    'Each panel is a titled card; the empty states are plain text.',
  ],
  example: `import { RunView } from './RunView';

const Run = () => <RunView />;
`,
  buildingBlock: true,
} satisfies ComponentUsage;

export { usage };
