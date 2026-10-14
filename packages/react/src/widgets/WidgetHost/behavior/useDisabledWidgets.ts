/* @layer renderer-shell @kind hook */
import { useCallback } from 'react';
import type { WidgetDisabledState } from '@drizztdourden08/tessera/composites';
import type { WidgetDef } from '../../widget.type';
import type { WidgetDisabledHook } from '../WidgetHost.type';
import { useNoneDisabled } from './useNoneDisabled';

const useDisabledWidgets = (hook: WidgetDisabledHook | undefined): ((definition: WidgetDef) => WidgetDisabledState | null) => {
  const useHook = hook ?? useNoneDisabled;
  const disabledOf = useHook();
  return useCallback((definition: WidgetDef) => disabledOf(definition.id), [disabledOf]);
};

export { useDisabledWidgets };
