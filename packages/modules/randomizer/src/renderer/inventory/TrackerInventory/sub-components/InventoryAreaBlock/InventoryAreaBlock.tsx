/* @layer renderer-shell @kind component */
import { Flex, Stack, Text } from '@drizztdourden08/tessera/primitives';
import { slotView } from '../../../behavior/slot-view';
import { InventorySlotCell } from '../InventorySlotCell';
import type { InventoryAreaBlockProps } from './InventoryAreaBlock.type';

const InventoryAreaBlock = ({ area, held, artOf }: InventoryAreaBlockProps) => (
  <Stack gap="xs">
    {area.label !== undefined && <Text variant="caption" tone="faint">{area.label}</Text>}
    {area.rows.map((row, index) => (
      <Flex key={`${area.id}-${index}`} gap="sm" wrap>
        {row.map((slot) => {
          const view = slotView(slot, held);
          return <InventorySlotCell key={slot.id} slot={slot} view={view} art={artOf?.(view.artKey) ?? null} />;
        })}
      </Flex>
    ))}
  </Stack>
);

export { InventoryAreaBlock };
