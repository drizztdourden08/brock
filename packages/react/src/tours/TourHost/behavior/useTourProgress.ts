/* @layer renderer-shell @kind hook */
import { useEffect } from 'react';
import { useProfilesStore } from '../../../stores/useProfilesStore';
import { tourPersistence } from '../../tour-persistence';

const useTourProgress = (): void => {
  const profileId = useProfilesStore((s) => s.active?.id ?? null);

  useEffect(() => {
    let live = true;
    void tourPersistence.load(profileId, () => live);
    return () => { live = false; };
  }, [profileId]);

  useEffect(tourPersistence.watch, []);
};

export { useTourProgress };
