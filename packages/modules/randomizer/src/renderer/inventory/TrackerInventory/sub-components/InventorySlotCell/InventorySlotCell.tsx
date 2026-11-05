/* @layer renderer-shell @kind component */
import { Box, Center, Image, Stack, Text } from '@drizztdourden08/tessera/primitives';
import type { InventorySlotCellProps } from './InventorySlotCell.type';

const InventorySlotCell = ({ slot, view, art }: InventorySlotCellProps) => {
  const label = view.tiered && view.level > 0 ? `${slot.label} ${view.level}` : slot.label;
  const fallback = <Center><Text tone="faint">{slot.label.slice(0, 2)}</Text></Center>;
  return (
    <Box disabled={view.level === 0} title={label}>
      <Stack gap="2xs" align="center">
        {art === null ? fallback : <Image src={art} alt={label} draggable={false} pixelated frame fallback={fallback} />}
        <Text variant="caption" tone={view.level === 0 ? 'faint' : undefined}>{label}</Text>
      </Stack>
    </Box>
  );
};

export { InventorySlotCell };
