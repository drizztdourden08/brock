/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import { widgetWindowId } from './widget-window-id';
import type { WindowKind } from './widget.type';

const useWindowKind = (): WindowKind => useMemo(() => {
  const id = widgetWindowId();
  return id === null ? { kind: 'main' } : { kind: 'widget', id };
}, []);

export { useWindowKind };
