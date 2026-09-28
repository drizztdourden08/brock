/* @layer renderer-shell @kind hook */
import { useContext } from 'react';
import type { Platform } from '@drizztdourden08/brock-core';
import { PlatformContext } from './platform-context';

const usePlatform = (): Platform => {
  const platform = useContext(PlatformContext);
  if (!platform) throw new Error('usePlatform must be used within <PlatformProvider>');
  return platform;
};

export { usePlatform };
