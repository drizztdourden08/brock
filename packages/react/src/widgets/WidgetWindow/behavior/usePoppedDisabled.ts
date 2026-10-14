/* @layer renderer-shell @kind hook */
import { hostApi } from '../../../host/host-api';
import { useDisabledWidgets } from '../../WidgetHost/behavior/useDisabledWidgets';
import type { WidgetDisabledHook } from '../../WidgetHost/WidgetHost.type';
import type { WidgetDef } from '../../widget.type';
import type { PoppedDisabled } from '../WidgetWindow.type';

const openInMain = (target: string): void => hostApi()?.openWidgetSetting(target);

const usePoppedDisabled = (definition: WidgetDef | undefined, hook: WidgetDisabledHook | undefined): PoppedDisabled => {
  const resolveDisabled = useDisabledWidgets(hook);
  const state = definition ? resolveDisabled(definition) : null;
  if (state === null) return {};
  return { disabled: state.message || true, onOpenSettings: () => openInMain(state.settingId) };
};

export { usePoppedDisabled };
