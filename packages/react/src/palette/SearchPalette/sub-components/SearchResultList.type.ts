/* @layer renderer-shell @kind types */
import type { SearchEntry } from '../../palette.type';

interface SearchResultListProps {
  items: readonly SearchEntry[];
  idle: boolean;
  query: string;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  onSelect: (entry: SearchEntry) => void;
}

export type { SearchResultListProps };
