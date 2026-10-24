/* @layer renderer-shell @kind component */
import { Box, Span } from '@drizztdourden08/tessera/primitives';
import type { ControllerRowsProps } from '../ControllerLayout.type';

const ControllerRows = (props: ControllerRowsProps) => {
  const { rows, label } = props;
  if (rows.length === 0) return null;

  return (
    <Box as="ul" className="input-controller-layout__rows" aria-label={label}>
      {rows.map((row) => (
        <Box as="li" key={row.id} className="input-controller-layout__row" data-active={row.active ? '' : undefined}>
          {row.glyph !== undefined && row.glyph !== null && <Box as="span" className="input-controller-layout__row-glyph" aria-hidden="true">{row.glyph}</Box>}
          <Span className="input-controller-layout__row-label">{row.label}</Span>
          {row.amount !== undefined && <Span className="input-controller-layout__row-amount">{`${row.amount}%`}</Span>}
        </Box>
      ))}
    </Box>
  );
};

export { ControllerRows };
