/* @layer renderer-shell @kind hook */
import { useCallback, useEffect, useRef } from 'react';
import type { BugReportExtras } from '@drizztdourden08/brock-core';
import { captureExtras } from '../../capture-extras';
import { useBugReportStore } from '../../useBugReportStore';

const useReportExtras = (open: boolean): (() => Promise<BugReportExtras | undefined>) => {
  const source = useBugReportStore((s) => s.extras);
  const captured = useRef<Promise<BugReportExtras | undefined> | null>(null);

  useEffect(() => {
    captured.current = open ? captureExtras(source) : null;
  }, [open, source]);

  return useCallback(() => captured.current ?? captureExtras(source), [source]);
};

export { useReportExtras };
