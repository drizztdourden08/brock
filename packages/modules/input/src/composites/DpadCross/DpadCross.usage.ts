/* @layer renderer-components @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'A plus-shaped directional pad drawn in an SVG, where each arm lights while its direction is held.',
  useWhen: ['The directional pad is one part of a drawing of a controller, centered at a point.'],
  avoidWhen: [{ case: 'Showing where a stick points.', use: 'StickPlot' }],
  rules: [
    'Pass cx, cy and size to place it, and state with the four directions held.',
    'Use IDLE_DPAD as the state while nothing is held.',
    'Use it only inside an svg element.',
  ],
  a11y: ['The cross is part of a drawing; the inputs held are listed as text beside it.'],
  example: `import { DpadCross } from '@drizztdourden08/brock-input/renderer';

const Cross = () => (
  <svg viewBox="0 0 100 100" width={100} height={100}>
    <DpadCross cx={50} cy={50} size={40} state={{ up: true, right: false, down: false, left: false }} />
  </svg>
);
`,
  buildingBlock: true,
  propsHash: '09d3e6fd90ea53e0',
} satisfies ComponentUsage;

export { usage };
