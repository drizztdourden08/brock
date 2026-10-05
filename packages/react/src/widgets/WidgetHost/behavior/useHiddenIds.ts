/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import type { WidgetLayout } from '@drizztdourden08/tessera/composites';
import { DEFAULT_CONTEXT } from '../../../contexts/contexts.constants';
import { useContextsStore } from '../../../contexts/useContextsStore';
import { isReviewLaunch } from '../../../host/is-review-launch';
import { outOfContext } from '../../out-of-context';
import type { WidgetDef } from '../../widget.type';
import { ID_JOIN } from './useWidgetGates.constants';

const useHiddenIds = (definitions: readonly WidgetDef[], layout: WidgetLayout, legacy: boolean | null): string => {
  const contexts = useContextsStore((s) => s.contexts);
  return useMemo(() => {
    if (isReviewLaunch()) return '';
    const isActive = (name: string): boolean => (name === DEFAULT_CONTEXT && legacy !== null ? legacy : contexts[name]?.active === true);
    return outOfContext(layout, definitions, isActive).join(ID_JOIN);
  }, [definitions, layout, legacy, contexts]);
};

export { useHiddenIds };
