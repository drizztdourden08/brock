/* @layer renderer-shell @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'The canvas a ported game draws its picture on, with pixel art kept sharp by default.',
  useWhen: [
    'A game port needs a focusable surface to render frames into.',
  ],
  propsHash: '653828e1c6bdff7b',
  avoidWhen: [
    { case: 'A chart or a drawing the app owns, not a game frame.', use: 'Card' },
  ],
  rules: [
    'Pass canvasRef and draw into it from the game loop.',
    'Smooth is off by default so pixels stay crisp; set smooth for filtered scaling.',
    'The right click menu is turned off over the canvas.',
  ],
  a11y: [
    'The canvas takes focus and carries an aria-label, "Game screen" unless label is set.',
  ],
  example: `import { GameCanvas } from '@drizztdourden08/brock-port-kit/renderer';

import { useRef } from 'react';

const Screen = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  return <GameCanvas canvasRef={canvasRef} />;
};
`,
  buildingBlock: true,
} satisfies ComponentUsage;

export { usage };
