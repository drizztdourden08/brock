/* @layer renderer-shell @kind types */
import type { HubRenderContext } from '../../../hub.type';

interface HubPageSlotProps {
  context: HubRenderContext;
  onSelectTab: (id: string) => void;
  onUp: () => void;
}

export type { HubPageSlotProps };
