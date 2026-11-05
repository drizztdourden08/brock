/* @layer renderer-components @kind component */
import { Box, Image, Text } from '@drizztdourden08/tessera/primitives';
import { useGlyphSourceStore } from '../../../renderer/useGlyphSourceStore';
import { glyphUrl } from '../behavior/glyph-url';
import type { ReservedBindingRowProps } from './ReservedBindingRow.type';

const ReservedBindingRow = ({ row, title }: ReservedBindingRowProps) => {
  const sources = useGlyphSourceStore((state) => state.sources);
  const iconSrc = row.glyph ? glyphUrl([row.glyph], sources) : null;
  return (
    <Box className="binding-row binding-row--reserved" title={title}>
      <Text className="binding-row__action-label">{row.label}</Text>
      <Box className="binding-row__rest">
        <Box className="binding-row__icon-slot" />
        <Text className="binding-row__middle-label" />
        <Box className="binding-row__icon-slot">
          {iconSrc ? <Image src={iconSrc} alt={row.bindingLabel} className="binding-row__icon-img" /> : null}
        </Box>
        <Text className="binding-row__binding-label">{row.bindingLabel}</Text>
      </Box>
    </Box>
  );
};

export { ReservedBindingRow };
