/* @layer renderer-shell @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'A round plot of one stick: a dot at its position inside a ring, with optional dead zones, the measured range and the recorded center, and the numbers beside it.',
  useWhen: [
    'A device card or a test screen shows where each stick points.',
    'A calibration step draws the stick large, with the range it has reached and the dead zones.',
  ],
  avoidWhen: [
    { case: 'The whole pad is drawn with every button and both sticks in place.', use: 'ControllerLayout' },
    { case: 'Only showing which buttons are held.', use: 'PressedGrid' },
  ],
  rules: [
    'Pass x and y from -1 to 1 with y up; the dot rests at the center when both are zero.',
    'Pass innerDeadzone and outerDeadzone as shares of the radius to draw the zones; the dot dims while it sits inside the inner one.',
    'Pass range and center from a calibration to draw the measured box and the recorded center.',
    'Set calibrated once the stick has a stored calibration, so the readout says so.',
    'Use size lg for a calibration step and md in a card.',
    'Pass label to name the plot; without it the plot is named Stick position.',
  ],
  a11y: [
    'The plot is one image named by label.',
    'The readout repeats x and y as text, so the position is never only a drawing.',
  ],
  tree: {
    path: ['data', 'controller or keyboard input', 'where a stick points'],
    rule: 'One stick as a dot inside its ring, with its zones and numbers.',
  },
  example: `import { StickPlot } from '@drizztdourden08/brock-input/renderer';

const LeftStick = ({ x, y }: { x: number; y: number }) => (
  <StickPlot x={x} y={y} label="Left stick" innerDeadzone={0.1} outerDeadzone={0.95} calibrated />
);
`,
  propsHash: 'cd30550a267f1c3c',
} satisfies ComponentUsage;

export { usage };
