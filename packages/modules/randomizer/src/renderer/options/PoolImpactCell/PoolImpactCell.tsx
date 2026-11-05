/* @layer renderer-shell @kind component */
import { Text } from '@drizztdourden08/tessera/primitives';
import type { PoolImpactCellProps } from './PoolImpactCell.type';

const PoolImpactCell = ({ cell }: PoolImpactCellProps) => (
  <Text variant="caption" mono numeric tone={cell.muted ? 'muted' : 'primary'} title={cell.text} clamp={1}>
    {cell.text}
  </Text>
);

export { PoolImpactCell };
