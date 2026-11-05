/* @layer renderer-shell @kind types */
import type { useOptimize } from '../../useOptimize';

type OptimizeBodyProps = Pick<
  ReturnType<typeof useOptimize>,
  'step' | 'tool' | 'analysis' | 'progress' | 'result' | 'error' | 'convertibleCount'
>;

export type { OptimizeBodyProps };
