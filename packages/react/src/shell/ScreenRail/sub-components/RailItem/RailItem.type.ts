/* @layer renderer-shell @kind types */
import type { RailEntry } from '../../ScreenRail.type';

interface RailItemProps {
  entry: RailEntry;
  onSelect: (id: string) => void;
}

export type { RailItemProps };
