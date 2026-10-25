/* @layer renderer-shell @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'A grid of the buttons of a controller, each with its glyph, where the ones held light up.',
  useWhen: [
    'A device card or a test screen shows which buttons of a pad are held right now.',
    'A calibration step shows the buttons held, so a stray press shows before it spoils the reading.',
  ],
  avoidWhen: [
    { case: 'The buttons sit in their place on a drawing of the pad.', use: 'ControllerSilhouette' },
    { case: 'Showing where a stick points.', use: 'StickPlot' },
    { case: 'A set of choices the user picks from.', use: 'SegmentedControl' },
  ],
  rules: [
    'Pass items as { id, label, title, icon }, and pressed as the ids held now.',
    'Pass family, such as xbox or playstation, so the glyphs match the pad; without it the generic glyphs show.',
    'Name an item by its SDL button name, such as SOUTH, so family draws its glyph; pass icon to draw another glyph and label to write text in the cell.',
    'Pass title for the tooltip of a cell; it falls back to the id.',
    'Keep the ids of items stable from one frame to the next, so a cell lights without redrawing the rest.',
  ],
  a11y: [
    'Each cell has a title, and a held cell sets a state attribute, not only a color.',
  ],
  tree: {
    path: ['data', 'controller or keyboard input', 'which buttons are held'],
    rule: 'A grid of the buttons of a pad that lights the ones held.',
  },
  example: `import { PressedGrid } from '@drizztdourden08/brock-input/renderer';

const Buttons = ({ held }: { held: string[] }) => (
  <PressedGrid
    family="xbox"
    items={[{ id: 'SOUTH', label: 'A' }, { id: 'EAST', label: 'B' }, { id: 'WEST', label: 'X' }, { id: 'NORTH', label: 'Y' }]}
    pressed={held}
  />
);
`,
  propsHash: '6b2345f8699cb01e',
} satisfies ComponentUsage;

export { usage };
