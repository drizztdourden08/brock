/* @layer renderer-shell @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'The step that shows whether ffmpeg is installed and installs it, with its progress and errors.',
  propsHash: '0000000000000000',
  useWhen: ['In a flow that needs ffmpeg, such as recording or media conversion.'],
  avoidWhen: [{ case: 'A job with its own log and steps.', use: 'JobDialog' }],
  rules: ['Pass the tool state from useTool; show installing while the install runs.'],
  a11y: ['The install button names its action and errors are text.'],
  tree: { path: ['feedback', 'a long job with steps, a log or a failure'], rule: 'Installing ffmpeg.' },
  example: `import { FfmpegInstallStep, useTool } from '@drizztdourden08/brock-tools/renderer';

const Mounted = () => {
  const tool = useTool('ffmpeg');
  return <FfmpegInstallStep state={tool.state} installing={tool.installing} error={tool.error} onInstall={() => { void tool.install(); }} />;
};
`,
} satisfies ComponentUsage;

export { usage };
