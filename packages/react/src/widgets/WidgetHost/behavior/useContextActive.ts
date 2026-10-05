/* @layer renderer-shell @kind hook */
import { useCallback } from 'react';
import type { WidgetContextActive } from '@drizztdourden08/tessera/composites';
import { DEFAULT_CONTEXT } from '../../../contexts/contexts.constants';
import { useContextsStore } from '../../../contexts/useContextsStore';
import { isReviewLaunch } from '../../../host/is-review-launch';
import type { WidgetDef } from '../../widget.type';

const useContextActive = (legacy: boolean | null): WidgetContextActive<WidgetDef> => {
  const contexts = useContextsStore((s) => s.contexts);
  const isActive = useCallback((def: WidgetDef): boolean => {
    const name = def.context ?? DEFAULT_CONTEXT;
    return name === DEFAULT_CONTEXT && legacy !== null ? legacy : contexts[name]?.active === true;
  }, [contexts, legacy]);
  return isReviewLaunch() ? true : isActive;
};

export { useContextActive };
