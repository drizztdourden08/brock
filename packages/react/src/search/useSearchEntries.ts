/* @layer renderer-shell @kind hook */
import { useEffect } from 'react';
import { currentRoute } from './current-route';
import { liveEntry } from './live-entry';
import type { SearchEntrySeed } from './search.type';
import { useLiveSearchStore } from './useLiveSearchStore';

const useSearchEntries = (entries: readonly SearchEntrySeed[], route?: string): void => {
  useEffect(() => {
    const at = route ?? currentRoute();
    if (at === null || entries.length === 0) return undefined;
    return useLiveSearchStore.getState().add(entries.map((entry) => liveEntry(entry, at)));
  }, [entries, route]);
};

export { useSearchEntries };
