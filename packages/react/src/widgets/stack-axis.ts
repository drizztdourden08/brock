/* @layer renderer-shell @kind logic */
import type { SnapSide, SplitAxis } from '@drizztdourden08/tessera/composites';

const stackAxis = (side: SnapSide): SplitAxis => (side === 'left' || side === 'right' ? 'column' : 'row');

export { stackAxis };
