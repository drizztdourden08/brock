/* @layer renderer-shell @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'The options page of the run: the option panel of the game, or a plain list of the option values.',
  useWhen: [
    'A page that shows the options a seed was rolled with.',
  ],
  propsHash: '69a6789bb8733db8',
  avoidWhen: [
    { case: 'A form that edits settings.', use: 'Field' },
  ],
  rules: [
    'It takes no props; it reads the active profile and game.',
    'A game can replace it with its own Options view.',
    'With no data it shows an empty message.',
  ],
  a11y: [
    'Rows are label and value text, and the empty state is plain text.',
  ],
  example: `import { OptionsView } from './OptionsView';

const Options = () => <OptionsView />;
`,
  buildingBlock: true,
} satisfies ComponentUsage;

export { usage };
