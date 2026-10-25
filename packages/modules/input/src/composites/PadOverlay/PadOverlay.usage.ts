/* @layer renderer-components @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'A drawing of a controller with each button, stick and trigger labeled by a callout and lit while held.',
  useWhen: ['The live input of one controller shows on its own picture, with a glyph and a name for each part.'],
  avoidWhen: [{ case: 'Showing where a stick points.', use: 'StickPlot' }],
  rules: [
    'Pass outline and anchors from the silhouette of the pad, slots for the parts to draw, and state for what is held now.',
    'Each slot names its anchor, its kind (button, analog, stick or dpad), its glyph image and its label.',
    'Pass label for the name read aloud; the drawing grows above and below when the callouts need more room.',
  ],
  a11y: ['The drawing is a labelled figure that lists the inputs held down as text.'],
  example: `import { PadOverlay } from '@drizztdourden08/brock-input/renderer';
import type { ControllerSilhouetteAnchorSet } from '@drizztdourden08/tessera/composites';

const Pad = ({ outline, anchors }: { outline: string; anchors: ControllerSilhouetteAnchorSet }) => (
  <PadOverlay outline={outline} anchors={anchors} slots={[]} state={{}} label="Controller" />
);
`,
  buildingBlock: true,
  propsHash: '5cf4e169b6521b3b',
} satisfies ComponentUsage;

export { usage };
