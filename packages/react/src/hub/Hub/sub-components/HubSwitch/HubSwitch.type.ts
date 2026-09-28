/* @layer renderer-shell @kind types */
import type { HubDef } from '../../../hub.type';

interface HubSwitchProps {
  hubs: readonly HubDef[];
  current: string;
  onSelect: (id: string) => void;
}

export type { HubSwitchProps };
