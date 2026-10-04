/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import { jobs } from './jobs';
import type { UseJobResult } from './jobs.type';
import { useJobStore } from './useJobStore';

const useJob = (id: string): UseJobResult => {
  const job = useJobStore((s) => s.jobs[id] ?? null);
  const shown = useJobStore((s) => s.shown === id);
  const controls = useMemo(() => ({
    open: () => jobs.open(id),
    hide: jobs.hide,
    cancel: () => jobs.cancel(id),
    dismiss: () => jobs.dismiss(id),
  }), [id]);
  return { job, shown, ...controls };
};

export { useJob };
