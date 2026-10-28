/* @layer renderer-shell @kind logic */
import type { SnapSide, SplitAxis } from '@drizztdourden08/tessera/composites';

const sideAxis = (side: SnapSide | null): SplitAxis => (side === 'left' || side === 'right' ? 'row' : 'column');

export { sideAxis };
