/* @layer renderer-shell @kind component */
import { useEffect, useState } from 'react';
import { applyWebDevice } from '../apply-web-device';
import { getPlatform } from '../get-platform';
import { watchWebDevice } from '../hosts/watch-web-device';
import { PlatformContext } from '../platform-context';
import { setPlatformPorts } from '../set-platform-ports';
import type { PlatformProviderProps } from './PlatformProvider.type';

const PlatformProvider = (props: PlatformProviderProps) => {
  const { ports, children } = props;
  const [platform, setPlatform] = useState(() => {
    if (ports) setPlatformPorts(ports);
    return getPlatform();
  });
  const { host } = platform.info;

  useEffect(() => (host === 'web' ? watchWebDevice((device) => setPlatform(applyWebDevice(device))) : undefined), [host]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('platform-mobile', platform.info.formFactor === 'mobile');
    return () => root.classList.remove('platform-mobile');
  }, [platform]);

  return <PlatformContext.Provider value={platform}>{children}</PlatformContext.Provider>;
};

export { PlatformProvider };
