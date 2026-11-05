/* @layer renderer-shell @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'A button that starts and stops a frame recording of the app, checks that ffmpeg is installed first, and hands the frames to the main process to encode.',
  propsHash: '0000000000000000',
  useWhen: [
    'A debug or bug report flow where the user records what went wrong.',
    'Any screen that records frames and wants them encoded to a video.',
  ],
  avoidWhen: [{ case: 'A plain button that runs one action with no recording.', use: 'Button' }],
  rules: [
    'Pass scope to group recordings, such as a profile id, and captureFrame to return one frame as a Blob.',
    'Register an ffmpeg tool with defineTool under the id ffmpeg on the main side.',
    'Wrap the bug report transport with withSentTagging so sent recordings get a sentAt stamp.',
  ],
  a11y: [
    'The button names its action and reports its pressed state.',
    'The elapsed time is plain text.',
  ],
  buildingBlock: true,
  example: `import { RecordingButton } from '@drizztdourden08/brock-tools/renderer';

const Mounted = ({ capture }: { capture: () => Promise<Blob | null> }) => (
  <RecordingButton scope="default" captureFrame={capture} />
);
`,
} satisfies ComponentUsage;

export { usage };
