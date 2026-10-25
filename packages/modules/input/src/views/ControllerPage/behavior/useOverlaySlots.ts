/* @layer renderer-components @kind hook */
import { useMemo } from 'react';
import type { DeviceEntry } from '../../../device.type';
import type { ResolvedDevice } from '../../../family';
import { useGlyphSourceStore } from '../../../renderer/useGlyphSourceStore';
import { layoutFamilyOf } from '../../../controller-families/layout-family-of';
import { positionIconsOf } from '../../../pad-overlay/position-icons';
import { resolveOverlay } from '../../../pad-overlay/resolve-overlay';
import { CONTROLLER_SILHOUETTE_PATHS } from '@drizztdourden08/tessera/composites';
import { CONTROLLER_SILHOUETTE_ANCHORS } from '../../../controller-anchors';
import { vidPidKey } from '../../../pad-overlay/vid-pid-key';
import type { PadOverlayModel } from '../ControllerPage.type';
import { slotViewsOf } from './slot-views';

const useOverlaySlots = (entry: DeviceEntry | undefined, resolved: ResolvedDevice | null): PadOverlayModel | null => {
  const sources = useGlyphSourceStore((state) => state.sources);
  return useMemo(() => {
    if (!entry || !resolved) return null;
    const positions = new Set<string>(resolved.controls.map((control) => control.position));
    const family = layoutFamilyOf(entry.family, positions);
    const { variant, slots } = resolveOverlay(family, vidPidKey(entry.vendorId, entry.productId), positions);
    return {
      outline: CONTROLLER_SILHOUETTE_PATHS[variant],
      anchors: CONTROLLER_SILHOUETTE_ANCHORS[variant],
      slots: slotViewsOf(slots, sources),
      icons: positionIconsOf(slots, positions),
    };
  }, [entry, resolved, sources]);
};

export { useOverlaySlots };
