/* @layer renderer-shell @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'A dialog that tells the user ffmpeg is needed and lets them install it, closing itself once the tool is ready.',
  propsHash: '0000000000000000',
  useWhen: ['When an action needs ffmpeg and it is not installed.'],
  avoidWhen: [{ case: 'A question with a yes or no answer.', use: 'Dialog' }],
  rules: ['Control open from the caller and close it with onClose.'],
  a11y: ['It is a dialog with a title and a skip button.'],
  tree: { path: ['something over the page', 'a question the user must answer'], rule: 'The ffmpeg required notice.' },
  example: `import { FfmpegRequiredDialog } from '@drizztdourden08/brock-tools/renderer';

const Mounted = () => <FfmpegRequiredDialog open onClose={() => undefined} />;
`,
} satisfies ComponentUsage;

export { usage };
