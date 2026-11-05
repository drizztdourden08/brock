/* @layer renderer-shell @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'A right side drawer that holds the app menu, the widgets, the mute switch and the frame rate on a phone sized screen.',
  useWhen: [
    'A game port runs on touch devices and needs its menu reachable without a menu bar.',
  ],
  propsHash: '8660b6519271fd0e',
  avoidWhen: [
    { case: 'A drawer for content that is not the app menu.', use: 'Dialog' },
    { case: 'A menu that opens from one button.', use: 'DropdownMenu' },
  ],
  rules: [
    'Entries come from the app menu; pass extraEntries to add more.',
    'Pass fps to show the frame rate; it reads 0 while the drawer is closed.',
    'The back gesture closes the drawer first.',
  ],
  a11y: [
    'The drawer is labelled, by default with the shell drawer label; pass label to change it.',
  ],
  example: `import { MobileShell } from '@drizztdourden08/brock-port-kit/renderer';

const Mounted = ({ fps }: { fps: number }) => <MobileShell fps={fps} />;
`,
  buildingBlock: true,
} satisfies ComponentUsage;

export { usage };
