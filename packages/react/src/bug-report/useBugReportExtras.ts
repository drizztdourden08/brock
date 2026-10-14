/* @layer renderer-shell @kind hook */
import { useEffect, useRef } from 'react';
import type { BugReportExtrasSource } from './bug-report.type';
import { useBugReportStore } from './useBugReportStore';

const useBugReportExtras = (source: BugReportExtrasSource): void => {
  const latest = useRef(source);
  latest.current = source;

  useEffect(() => {
    const own: BugReportExtrasSource = () => latest.current();
    useBugReportStore.getState().setExtras(own);
    return () => {
      if (useBugReportStore.getState().extras === own) useBugReportStore.getState().setExtras(null);
    };
  }, []);
};

export { useBugReportExtras };
