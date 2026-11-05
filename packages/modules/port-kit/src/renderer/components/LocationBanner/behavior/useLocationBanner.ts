/* @layer renderer-shell @kind hook */
import { useEffect, useState, useSyncExternalStore } from 'react';
import type { BannerEntry, LocationNameOf } from '../LocationBanner.type';
import { createLocationBannerStore } from './create-location-banner-store';

const useLocationBanner = <Location,>(
  location: Location,
  locationNameOf: LocationNameOf<Location>,
  dismissMs: number,
): BannerEntry | null => {
  const [store] = useState(() => createLocationBannerStore(dismissMs));

  useEffect(() => {
    store.announce(locationNameOf(location));
  }, [store, location, locationNameOf]);

  useEffect(() => store.dispose, [store]);

  return useSyncExternalStore(store.subscribe, store.get, store.get);
};

export { useLocationBanner };
