/* @layer renderer-shell @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'A plain outline of a controller with every button, trigger and stick in its place, lit while it is held, to test a gamepad or show what it sends.',
  useWhen: [
    'A controller test screen shows the whole pad at once, the way a console test screen does.',
    'A settings card shows which buttons the player is holding and where the sticks point.',
  ],
  avoidWhen: [
    { case: 'A flat set of buttons with no place on a pad, such as a keyboard or a list of switches.', use: 'PressedGrid' },
    { case: 'One stick alone, with dead zones, a measured range and its numbers.', use: 'StickPlot' },
    { case: 'A keyboard with keys marked or held.', use: 'KeyboardLayout' },
  ],
  rules: [
    'Pick the variant from the pad family: offset for Xbox shapes, symmetric for PlayStation shapes, nintendo for Switch shapes and pad for a pad with no sticks.',
    'Pass only the slots the device has. A slot not given is drawn idle with no label.',
    'Give the face buttons a label or a glyph from the pad family, such as A, B, X and Y, so the player sees the names printed on the device.',
    'Send triggers and shoulders as value from 0 to 1, and sticks as x and y from -1 to 1 with y up.',
    'Put buttons the outline has no place for, such as paddles, in extras. They show in a list under the outline, one row each.',
  ],
  a11y: [
    'The figure is named by label, Controller by default.',
    'The drawing is hidden from screen readers. A hidden list names what is held now, so moving a stick does not announce anything.',
    'The list under the outline is a named list, one item per input it holds.',
  ],
  tree: {
    path: ['data', 'controller or keyboard input', 'every input on a controller'],
    rule: 'ControllerLayout draws every input of a pad in its place, so a test screen reads the same in every app.',
  },
  example: `import { ControllerLayout } from '@drizztdourden08/brock-input/renderer';
import type { ControllerSlots } from '@drizztdourden08/brock-input/renderer';

interface PadTestProps {
  slots: ControllerSlots;
}

const PadTest = ({ slots }: PadTestProps) => (
  <ControllerLayout
    variant="offset"
    slots={{
      ...slots,
      'face.south': { ...slots['face.south'], label: 'A' },
      'face.east': { ...slots['face.east'], label: 'B' },
    }}
    extras={[{ id: 'paddle1', label: 'Upper right paddle' }]}
  />
);
`,
  propsHash: '47c71b78de1af48f',
} satisfies ComponentUsage;

export { usage };
