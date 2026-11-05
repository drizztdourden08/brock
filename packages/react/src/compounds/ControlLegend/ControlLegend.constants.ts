/* @layer renderer-shell @kind constants */
import type { MouseButton } from '@drizztdourden08/tessera/primitives';
import type { MouseGlyph } from './ControlLegend.type';

const MOUSE_OF: Readonly<Record<MouseGlyph, MouseButton>> = {
  'mouse-left': 'left',
  'mouse-right': 'right',
  wheel: 'wheel',
};

export { MOUSE_OF };
