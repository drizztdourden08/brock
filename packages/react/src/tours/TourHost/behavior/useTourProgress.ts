/* @layer renderer-shell @kind hook */
import { useEffect } from 'react';
import { tourPersistence } from '../../tour-persistence';

const useTourProgress = (): void => {
  useEffect(() => {
    let live = true;
    void tourPersistence.load(() => live);
    return () => { live = false; };
  }, []);

  useEffect(tourPersistence.watch, []);
};

export { useTourProgress };
