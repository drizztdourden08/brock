/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import { useJob, useText } from '@drizztdourden08/brock-react';
import { importJobId } from '../../../store/import-job';
import { progressStateOf } from './progress-state-of';
import type { ImportKind, ImportProgressState } from './use-import-progress.type';

const useImportProgress = (kind: ImportKind): ImportProgressState => {
  const { job } = useJob(importJobId(kind));
  const text = useText();
  return useMemo(() => progressStateOf(job, text), [job, text]);
};

export { useImportProgress };
