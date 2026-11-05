/* @layer renderer-shell @kind types */
import type { BrowsedEntry } from '../browse/browsed-entry.type';

interface BrowsedLobbies {
  entries: BrowsedEntry[];
  loading: boolean;
}

export type { BrowsedLobbies };
