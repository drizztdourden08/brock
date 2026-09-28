/* @layer renderer-shell @kind types */
interface HubSwitchProps {
  current: string;
  onSelect: (id: string) => void;
}

export type { HubSwitchProps };
