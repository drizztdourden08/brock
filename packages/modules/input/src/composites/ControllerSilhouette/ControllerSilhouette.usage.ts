/* @layer renderer-components @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'The outline of a controller, one stroked line with no fill, for the app to draw its own glyphs, labels and lines on.',
  useWhen: [
    'A bindings screen points from each control of a pad to the action it does, with its own glyphs and leader lines.',
    'A tutorial or a help card shows a pad and marks the few controls it talks about.',
  ],
  avoidWhen: [
    { case: 'One button or stick glyph inline, such as a prompt in a sentence.', use: 'InputIcon' },
    { case: 'A keyboard with keys marked or held.', use: 'KeyboardLayout' },
  ],
  rules: [
    'Pick the variant from the pad family: offset for Xbox shapes, symmetric for PlayStation shapes, nintendo for Switch Pro shapes and pad for a pad with no sticks or triggers.',
    'Draw on it with children made of the Svg primitives. They sit inside the SVG on top of the outline, in viewBox units.',
    'The viewBox is CONTROLLER_SILHOUETTE_VIEW_BOX, 0 0 400 260, for every variant. It never changes, so coordinates stay valid.',
    'To draw the outline in your own SVG, take its path d from CONTROLLER_SILHOUETTE_PATHS[variant], in the same viewBox.',
    'Place marks from CONTROLLER_SILHOUETTE_ANCHORS, never from numbers of your own. Nothing is drawn at an anchor, it only says where the control sits on the real pad.',
    'A stick, the d-pad, the face cluster and each meta button have a centre and a radius r. A stick r is its well, the d-pad and face r hold the whole cluster, and a meta r is half the longest side of the button. Shoulders sit on the top edge. Triggers sit above their shoulder, outside the outline, since a trigger hides behind it from the front.',
    'A variant leaves out the anchors its pad has none of: pad has no sticks, no triggers, no guide and no capture, symmetric has no capture.',
    'Anchors are measured by Relic of the Past on the drawn outline and reviewed by its owner. Brock owns the table, so a fix to a position lands in brock-input.',
    'Sources. offset, symmetric and nintendo are drawn by hand with reference to Noun Project icons: XBOX Controller (icon 5652517) by Daniel Finnegan, pro controller (icon 5602909) by Eliran Bensadoun and playstation controller (icon 1751312) by dinnerchief. No path data is taken from them. pad is traced from SNES-Controller-Flat.jpg by Evan-Amos, Wikimedia Commons, public domain. Each outline is one mirrored half of smooth curves, with no brand marks.',
  ],
  a11y: [
    'The figure is named by label, Controller by default.',
    'The SVG is hidden from screen readers, children included. Give what the marks say in text outside it too, such as a list of bindings.',
  ],
  tree: {
    path: ['data', 'controller or keyboard input', 'a blank controller to draw on'],
    rule: 'ControllerSilhouette draws only the outline of a pad, so each app places its own marks at shared anchors.',
  },
  example: `import { CONTROLLER_SILHOUETTE_ANCHORS, ControllerSilhouette } from '@drizztdourden08/brock-input/renderer';
import { SvgCircle, SvgText } from '@drizztdourden08/tessera/primitives';

const anchors = CONTROLLER_SILHOUETTE_ANCHORS.offset;

const JumpHint = () => {
  const face = anchors.face;
  if (!face?.r) return null;
  return (
    <ControllerSilhouette variant="offset" label="Jump is the bottom face button">
      <SvgCircle cx={face.x} cy={face.y + face.r / 2} r={face.r / 3} />
      <SvgText x={face.x} y={face.y + face.r + 14} textAnchor="middle">Jump</SvgText>
    </ControllerSilhouette>
  );
};
`,
  propsHash: '1478dbd854e14e32',
} satisfies ComponentUsage;

export { usage };
