/* @layer renderer-shell @kind types */
import type { SpriteTileItem } from '../../SpriteTileSet.type';

interface SpriteTileProps {
  item: SpriteTileItem;
  disabled: boolean;
  readout: boolean;
  onChange?: (id: string, checked: boolean) => void;
}

export type { SpriteTileProps };
