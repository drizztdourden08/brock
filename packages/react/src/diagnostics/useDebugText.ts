/* @layer renderer-shell @kind hook */
import { useEffect, useMemo, useState } from 'react';
import { useProduct } from '../app/useProduct';
import { getAppLog } from '../log/get-app-log';
import { usePlatform } from '../platform/usePlatform';
import { buildDebugText } from './build-debug-text';
import type { DebugText } from './diagnostics.type';
import { fetchSystemDiagnostics } from './fetch-system-diagnostics';
import { readWindowEnvironment } from './read-window-environment';
import { runtimeLabels } from './runtime-labels';
import { useAppVersion } from './useAppVersion';

const useDebugText = (collect = true): DebugText => {
  const product = useProduct();
  const { info } = usePlatform();
  const version = useAppVersion();
  const labels = useMemo(() => runtimeLabels(info, navigator.userAgent), [info]);
  const [text, setText] = useState<string | null>(null);

  useEffect(() => {
    if (!collect) return;
    let live = true;
    void fetchSystemDiagnostics().then((system) => {
      if (!live) return;
      setText(buildDebugText({
        productName: product.name,
        version,
        labels,
        info,
        system,
        window: readWindowEnvironment(),
        logs: getAppLog().getEntries(),
        userAgent: navigator.userAgent,
      }));
    });
    return () => { live = false; };
  }, [collect, product.name, version, labels, info]);

  return { text: collect ? text : null, version, labels };
};

export { useDebugText };
