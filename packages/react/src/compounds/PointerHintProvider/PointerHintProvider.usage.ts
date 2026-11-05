/* @layer renderer-shell @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Wraps a panel so any control in it can show a small hint with its keys and mouse buttons that follows the pointer.',
  propsHash: '1bc5bf568a454eb2',
  useWhen: ['Around a cheats panel whose controls have different keys and clicks.'],
  avoidWhen: [{ case: 'A plain text hint on a control.', use: 'Tooltip' }],
  rules: [
    'Mount it once around the panel; read the hint props of a control with usePointerHintTarget(title, items) and spread them on the control.',
    'Outside the provider the hint props do nothing.',
  ],
  a11y: ['The hint is hidden from screen readers, so every control keeps its own label.'],
  buildingBlock: true,
  example: `import { PointerHintProvider } from '@drizztdourden08/brock-react';

const Mounted = () => <PointerHintProvider><div>Controls</div></PointerHintProvider>;
`,
} satisfies ComponentUsage;

export { usage };
