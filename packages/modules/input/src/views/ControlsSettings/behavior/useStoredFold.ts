/* @layer renderer-components @kind hook */
import { useCallback, useState } from 'react';
import type { StoredFold } from '../ControlsSettings.type';

const readFold = (storageKey: string): boolean | null => {
  try {
    const raw = localStorage.getItem(storageKey);
    return raw === null ? null : raw === 'true';
  } catch {
    return null;
  }
};

const writeFold = (storageKey: string, collapsed: boolean): boolean => {
  try {
    localStorage.setItem(storageKey, String(collapsed));
    return true;
  } catch {
    return false;
  }
};

const useStoredFold = (storageKey: string, defaultCollapsed: boolean): StoredFold => {
  const [collapsed, setCollapsed] = useState(() => readFold(storageKey) ?? defaultCollapsed);

  const apply = useCallback((next: boolean) => {
    setCollapsed(next);
    writeFold(storageKey, next);
  }, [storageKey]);

  const toggle = useCallback(() => apply(!collapsed), [apply, collapsed]);
  const expand = useCallback(() => apply(false), [apply]);
  const collapse = useCallback(() => apply(true), [apply]);

  return { collapsed, toggle, expand, collapse };
};

export { useStoredFold };
