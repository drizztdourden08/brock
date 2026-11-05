/* @layer renderer-shell @kind types */

interface SpriteTileItem {
  id: string;
  name: string;
  sprite?: string;
  checked: boolean;
  reason?: string;
  badge?: number;
}

interface SpriteTileSetProps {
  items: readonly SpriteTileItem[];
  order?: readonly string[];
  label?: string;
  disabled?: boolean;
  readout?: boolean;
  onChange?: (id: string, checked: boolean) => void;
}

export type { SpriteTileItem, SpriteTileSetProps };
