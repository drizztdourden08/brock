/* @layer renderer-shell @kind types */
type LocationNameOf<Location> = (location: Location) => string | null;

type BannerPhase = 'enter' | 'visible' | 'exit';

interface BannerEntry {
  name: string;
  stamp: number;
}

interface LocationBannerStore {
  get: () => BannerEntry | null;
  announce: (name: string | null) => void;
  subscribe: (listener: () => void) => () => void;
  dispose: () => void;
}

interface LocationBannerProps<Location> {
  location: Location;
  locationNameOf: LocationNameOf<Location>;
  dismissMs?: number;
}

interface BannerPlateProps {
  name: string;
  dismissMs: number;
}

export type { BannerEntry, BannerPhase, BannerPlateProps, LocationBannerProps, LocationBannerStore, LocationNameOf };
