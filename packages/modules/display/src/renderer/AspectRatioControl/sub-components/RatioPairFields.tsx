/* @layer renderer-shell @kind component */
import { Box, NumberInput, Text } from '@drizztdourden08/tessera/primitives';
import type { RatioPairFieldsProps } from '../AspectRatioControl.type';

const RatioPairFields = (props: RatioPairFieldsProps) => {
  const { w, h, check, onWidth, onHeight } = props;
  return (
    <Box className="aspect-ratio-control__pair">
      <Box className="aspect-ratio-control__pair-row">
        <NumberInput buttons="sides" aria-label="Ratio width" min={1} step={1} value={w} onChange={onWidth} />
        <Text className="aspect-ratio-control__detected">:</Text>
        <NumberInput buttons="sides" aria-label="Ratio height" min={1} step={1} value={h} onChange={onHeight} />
      </Box>
      {!check.valid && <Text className="aspect-ratio-control__capped">{check.error}</Text>}
    </Box>
  );
};

export { RatioPairFields };
