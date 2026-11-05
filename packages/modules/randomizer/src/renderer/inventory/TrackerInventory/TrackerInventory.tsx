/* @layer renderer-shell @kind component */
import { Callout, Stack } from '@drizztdourden08/tessera/primitives';
import { lacksArt } from '../behavior/lacks-art';
import { InventoryAreaBlock } from './sub-components/InventoryAreaBlock';
import { MISSING_ART_NOTICE } from './TrackerInventory.constants';
import type { TrackerInventoryProps } from './TrackerInventory.type';

const TrackerInventory = ({ layout, held, artOf, missingArtNotice }: TrackerInventoryProps) => (
  <Stack gap="md">
    {artOf !== undefined && lacksArt(layout, held, artOf) && <Callout tone="info">{missingArtNotice ?? MISSING_ART_NOTICE}</Callout>}
    {layout.areas.map((area) => <InventoryAreaBlock key={area.id} area={area} held={held} artOf={artOf} />)}
  </Stack>
);

export { TrackerInventory };
