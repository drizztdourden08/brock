/* @layer renderer-shell @kind hook */
import { useLayoutEffect } from 'react';
import { heroArtNone } from './hero-art-none';

const useHeroArtNone = (bucket: string | undefined, none: boolean): void => {
  useLayoutEffect(() => {
    if (bucket === undefined || !none) return undefined;
    heroArtNone.add(bucket);
    return () => {
      heroArtNone.delete(bucket);
    };
  }, [bucket, none]);
};

export { useHeroArtNone };
