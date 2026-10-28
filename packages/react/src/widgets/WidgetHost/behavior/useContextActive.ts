/* @layer renderer-shell @kind hook */
import { useCallback } from 'react';
import type { WidgetContextActive } from '@drizztdourden08/tessera/composites';
import { useContextsStore } from '../../../contexts/useContextsStore';
import { isReviewLaunch } from '../../../host/is-review-launch';
import { useRuleContext } from '../../useRuleContext';
import { widgetAvailable } from '../../widget-available';
import type { WidgetDef } from '../../widget.type';

const useContextActive = (legacy: boolean | null): WidgetContextActive<WidgetDef> => {
  const contexts = useContextsStore((s) => s.contexts);
  const show = useRuleContext();
  const isActive = useCallback((def: WidgetDef): boolean => widgetAvailable(def, contexts, legacy, show), [contexts, legacy, show]);
  return isReviewLaunch() ? true : isActive;
};

export { useContextActive };
