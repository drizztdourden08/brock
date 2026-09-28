/* @layer renderer-shell @kind hook */
import { useEffect, useState } from 'react';
import { hostApi } from '../host/host-api';
import { FALLBACK_VERSION } from './diagnostics.constants';

const useAppVersion = (): string => {
  const [version, setVersion] = useState(FALLBACK_VERSION);

  useEffect(() => {
    let live = true;
    hostApi()?.getAppVersion()
      .then((value) => { if (live && value) setVersion(value); })
      .catch(() => undefined);
    return () => { live = false; };
  }, []);

  return version;
};

export { useAppVersion };
