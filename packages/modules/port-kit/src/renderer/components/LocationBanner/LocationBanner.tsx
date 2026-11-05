/* @layer renderer-shell @kind component */
import { Box } from '@drizztdourden08/tessera/primitives';
import { useLocationBanner } from './behavior/useLocationBanner';
import { BannerPlate } from './sub-components/BannerPlate';
import { DEFAULT_BANNER_DISMISS_MS } from './LocationBanner.constants';
import type { LocationBannerProps } from './LocationBanner.type';
import './LocationBanner.css';

const LocationBanner = <Location,>({
  location,
  locationNameOf,
  dismissMs = DEFAULT_BANNER_DISMISS_MS,
}: LocationBannerProps<Location>) => {
  const entry = useLocationBanner(location, locationNameOf, dismissMs);

  return (
    <Box className="location-banner" aria-live="polite">
      {entry ? <BannerPlate key={entry.stamp} name={entry.name} dismissMs={dismissMs} /> : null}
    </Box>
  );
};

export { LocationBanner };
