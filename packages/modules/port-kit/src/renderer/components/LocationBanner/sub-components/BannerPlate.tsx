/* @layer renderer-shell @kind component */
import { useEffect, useState } from 'react';
import { Box, Text } from '@drizztdourden08/tessera/primitives';
import { BANNER_ENTER_DELAY_MS, BANNER_EXIT_MS } from '../LocationBanner.constants';
import type { BannerPhase, BannerPlateProps } from '../LocationBanner.type';

const BannerPlate = ({ name, dismissMs }: BannerPlateProps) => {
  const [phase, setPhase] = useState<BannerPhase>('enter');

  useEffect(() => {
    const enterTimer = setTimeout(() => setPhase('visible'), BANNER_ENTER_DELAY_MS);
    const exitTimer = setTimeout(() => setPhase('exit'), Math.max(dismissMs - BANNER_EXIT_MS, 0));
    return () => {
      clearTimeout(enterTimer);
      clearTimeout(exitTimer);
    };
  }, [dismissMs]);

  return (
    <Box className={`location-banner__plate location-banner__plate--${phase}`}>
      <Text className="location-banner__name">{name}</Text>
    </Box>
  );
};

export { BannerPlate };
