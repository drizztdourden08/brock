/* @layer renderer-shell @kind component */
import { Box, InputIcon, gamepadInputIcon, Span } from '@drizztdourden08/tessera/primitives';
import { PRESSED_GRID_ICON_SIZE } from '../PressedGrid.constants';
import type { PressedGridCellProps } from '../PressedGrid.type';

const PressedGridCell = (props: PressedGridCellProps) => {
  const { item, family, down } = props;
  const { id, label, title } = item;
  const icon = item.icon ?? (family ? gamepadInputIcon(family, id) : null);
  const text = label ?? (icon ? null : id);

  return (
    <Box surface="sunken" title={title ?? id} className="input-pressed-grid__cell" data-pressed={down ? '' : undefined}>
      {icon && <InputIcon {...icon} size={PRESSED_GRID_ICON_SIZE} tone="theme" className="input-pressed-grid__icon" />}
      {text != null && <Span className="input-pressed-grid__label">{text}</Span>}
    </Box>
  );
};

export { PressedGridCell };
