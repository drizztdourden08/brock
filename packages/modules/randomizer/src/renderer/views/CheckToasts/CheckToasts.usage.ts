/* @layer renderer-shell @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Small cards in the play area that announce a check just found and online notices, then fade by themselves.',
  useWhen: [
    'The play screen, so the player sees each new check without leaving the game.',
  ],
  propsHash: '0000000000000000',
  avoidWhen: [
    { case: 'A message the player must read or answer.', use: 'Dialog' },
  ],
  rules: [
    'Pass enabled false to turn the toasts off.',
    'duration sets how long a toast stays; quietMs holds back the burst when the page loads.',
    'noticeShown decides which online notice kinds may show.',
  ],
  a11y: [
    'Each toast has a text label, and the part renders nothing when no toast is waiting.',
  ],
  example: `import { CheckToasts } from './CheckToasts';

const Mounted = () => <CheckToasts duration={4000} />;
`,
  buildingBlock: true,
} satisfies ComponentUsage;

export { usage };
