/* @layer renderer-shell @kind component */
import { Stack } from '@drizztdourden08/tessera/primitives';
import { InventoryAreaBlock } from './sub-components/InventoryAreaBlock';
import type { TrackerInventoryProps } from './TrackerInventory.type';

const TrackerInventory = ({ layout, held, artOf }: TrackerInventoryProps) => (
  <Stack gap="md">
    {layout.areas.map((area) => <InventoryAreaBlock key={area.id} area={area} held={held} artOf={artOf} />)}
  </Stack>
);

export { TrackerInventory };
