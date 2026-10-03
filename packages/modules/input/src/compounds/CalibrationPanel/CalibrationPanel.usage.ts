/* @layer renderer-shell @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'One step of a controller calibration: the glyph and title of the control, an instruction, the live stick or trigger reading, the buttons held, and cancel and next.',
  useWhen: [
    'A stick or trigger calibration in the input tester or on a controller settings page.',
    'A step that asks the user to rest, roll or pull a control and shows the reading live.',
  ],
  avoidWhen: [
    { case: 'Only showing where a stick points, with no steps.', use: 'StickPlot' },
    { case: 'Only showing which buttons are held.', use: 'PressedGrid' },
    { case: 'A whole screen given to calibration.', use: 'StageScreen' },
  ],
  rules: [
    'Keep the steps in the view and pass the current one: the title, instruction, reading and action change from step to step.',
    'Name the control in reading by its SDL name, such as LEFT_STICK or LEFT_TRIGGER; the glyph is drawn from it.',
    'Disable the action until the reading is good enough to go on, such as a full roll of the stick.',
    'Put the controls of a step, such as the dead zone sliders, in children.',
    'Pass buttons to show the buttons held, so a stray press shows before it spoils the reading.',
  ],
  a11y: [
    'The panel is a section named by its title.',
    'The readout repeats the live reading as text.',
    'Cancel comes before the main action, which is the primary button.',
  ],
  tree: {
    path: ['data', 'controller or keyboard input', 'a calibration step'],
    rule: 'One step of a stick or trigger calibration with its live reading.',
  },
  example: `import { CalibrationPanel } from '@drizztdourden08/brock-input/renderer';

const CalibrationSample = ({ onCancel, onRecord }: { onCancel: () => void; onRecord: () => void }) => (
  <CalibrationPanel
    title="Calibrate Left stick"
    instruction="Let go of the stick so it rests at its center, then record it."
    reading={{ kind: 'stick', name: 'LEFT_STICK', label: 'Left stick', x: 0.02, y: -0.01 }}
    readout="x 0.02  y -0.01"
    action={{ label: 'Record center', onClick: onRecord }}
    onCancel={onCancel}
  />
);
`,
  propsHash: 'c8aa835f94cdc3cc',
} satisfies ComponentUsage;

export { usage };
