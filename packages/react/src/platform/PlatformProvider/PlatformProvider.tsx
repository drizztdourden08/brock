/* @layer renderer-shell @kind component */
import { useEffect, useMemo } from 'react';
import { getPlatform } from '../get-platform';
import { PlatformContext } from '../platform-context';
import { setPlatformPorts } from '../set-platform-ports';
import type { PlatformProviderProps } from './PlatformProvider.type';

const PlatformProvider = (props: PlatformProviderProps) => {
  const { ports, children } = props;
  const platform = useMemo(() => {
    if (ports) setPlatformPorts(ports);
    return getPlatform();
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('platform-mobile', platform.info.formFactor === 'mobile');
    return () => root.classList.remove('platform-mobile');
  }, [platform]);

  return <PlatformContext.Provider value={platform}>{children}</PlatformContext.Provider>;
};

export { PlatformProvider };
