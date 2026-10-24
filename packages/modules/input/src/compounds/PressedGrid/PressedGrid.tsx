/* @layer renderer-shell @kind component */
import { Grid } from '@drizztdourden08/tessera/primitives';
import { PressedGridCell } from './sub-components/PressedGridCell';
import type { PressedGridProps } from './PressedGrid.type';
import './PressedGrid.css';

const PressedGrid = (props: PressedGridProps) => {
  const { items, pressed, family, className = '' } = props;
  const down = new Set(pressed);

  return (
    <Grid gap="xs" className={`input-pressed-grid${className ? ` ${className}` : ''}`}>
      {items.map((item) => <PressedGridCell key={item.id} item={item} family={family} down={down.has(item.id)} />)}
    </Grid>
  );
};

export { PressedGrid };
