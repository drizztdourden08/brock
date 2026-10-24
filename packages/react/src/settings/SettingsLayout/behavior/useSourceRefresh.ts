/* @layer renderer-shell @kind hook */
import { useCallback, useEffect, useState } from 'react';
import type { SettingsValueSource } from '../../settings.type';

const useSourceRefresh = (sources: readonly SettingsValueSource[]): { version: number; refresh: () => void } => {
  const [version, setVersion] = useState(0);
  const refresh = useCallback(() => setVersion((current) => current + 1), []);
  useEffect(() => {
    const stops = sources.flatMap((source) => (source.subscribe ? [source.subscribe(refresh)] : []));
    return () => stops.forEach((stop) => stop());
  }, [sources, refresh]);
  return { version, refresh };
};

export { useSourceRefresh };
