/* @layer renderer-shell @kind types */
import type { SearchEntry } from '../../palette.type';

interface SearchResultRowProps {
  entry: SearchEntry;
  active: boolean;
  onSelect: (entry: SearchEntry) => void;
  onHover: () => void;
}

export type { SearchResultRowProps };
