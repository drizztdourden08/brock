/* @layer renderer-app @kind component */
import type { WidgetMeta } from '@drizztdourden08/brock-react';
import { SegmentedControl, Stack } from '@drizztdourden08/tessera/primitives';
import { useRandomizerGame } from '../renderer/game-registry/behavior/useRandomizerGame';
import { useRandomizerGameStore } from '../renderer/game-registry/behavior/useRandomizerGameStore';
import { useInventoryLayout } from '../renderer/inventory/behavior/useInventoryLayout';
import { TrackerInventory } from '../renderer/inventory/TrackerInventory';
import { useTrackerFeed } from '../renderer/tracker/hooks/behavior/useTrackerFeed';
import {
  INVENTORY_DOCKED_SIZE, INVENTORY_FLOATING_SIZE, INVENTORY_WIDGET_ICON, INVENTORY_WIDGET_LABEL, LAYOUT_LABEL,
} from './inventory.widget.constants';

const InventoryWidget = () => {
  const game = useRandomizerGame();
  const feed = useTrackerFeed();
  const inventory = game?.inventory;
  const [layout, setLayout] = useInventoryLayout(inventory ?? { layouts: [] });
  if (inventory === undefined || layout === undefined) return null;
  const options = inventory.layouts.map((candidate) => ({ value: candidate.id, label: candidate.label }));

  return (
    <Stack gap="md">
      {options.length > 1 && <SegmentedControl aria-label={LAYOUT_LABEL} size="sm" value={layout.id} options={options} onChange={setLayout} />}
      <TrackerInventory layout={layout} held={new Set(feed?.held ?? [])} artOf={game?.tracker?.artOf} />
    </Stack>
  );
};

const meta: WidgetMeta = {
  label: INVENTORY_WIDGET_LABEL,
  icon: INVENTORY_WIDGET_ICON,
  defaultVisibility: 'always',
  defaultSide: 'right',
  defaultDockedSize: INVENTORY_DOCKED_SIZE,
  defaultFloatingSize: INVENTORY_FLOATING_SIZE,
  popOut: false,
  when: { when: () => useRandomizerGameStore.getState().game?.inventory !== undefined },
};

export default InventoryWidget;
export { meta };
