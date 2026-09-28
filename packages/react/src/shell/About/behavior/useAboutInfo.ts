/* @layer renderer-shell @kind hook */
import { useEffect, useMemo, useState } from 'react';
import { hostApi } from '../../../host/host-api';
import { usePlatform } from '../../../platform/usePlatform';
import { FALLBACK_VERSION } from '../About.constants';
import type { AboutInfo, AboutRow } from '../About.type';

const useAboutInfo = (productName: string, extraRows: readonly AboutRow[] = []): AboutInfo => {
  const { info } = usePlatform();
  const [version, setVersion] = useState(FALLBACK_VERSION);

  useEffect(() => {
    let live = true;
    hostApi()?.getAppVersion().then((v) => { if (live && v) setVersion(v); }).catch(() => {});
    return () => { live = false; };
  }, []);

  return useMemo(() => {
    const rows: AboutRow[] = [
      { label: 'Version', value: version },
      { label: 'Host', value: info.host },
      { label: 'Platform', value: info.os },
      ...extraRows,
    ];
    const copyText = [`${productName} ${version}`, ...rows.map((r) => `${r.label}: ${r.value}`)].join('\n');
    return { version, rows, copyText };
  }, [version, info.host, info.os, productName, extraRows]);
};

export { useAboutInfo };
