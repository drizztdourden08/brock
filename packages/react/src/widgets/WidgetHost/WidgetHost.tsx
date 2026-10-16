/* @layer renderer-shell @kind component */
import { useCallback, useContext, useEffect, useMemo } from 'react';
import type { WidgetWindowOpen } from '@drizztdourden08/brock-core';
import { WidgetManager, getWidgetDefinition } from '@drizztdourden08/tessera/composites';
import type { Rect, ScreenPoint } from '@drizztdourden08/tessera/composites';
import { uniqueById } from '../../collections/unique-by-id';
import { SettingsStoreContext } from '../../stores/settings-context';
import { useProfilesStore } from '../../stores/useProfilesStore';
import { BUILT_IN_WIDGETS } from '../built-in-widgets.constants';
import { dragRelease } from '../drag-release';
import { NO_KITS } from '../kits/widget-kit.constants';
import { FLOATING_MIN, NO_WIDGETS } from '../widget.constants';
import { popOutWindow } from '../pop-out-window';
import { poppedShown } from '../popped-shown';
import { useWidgetLayoutStore } from '../useWidgetLayoutStore';
import { useWidgetRegistryStore } from '../useWidgetRegistryStore';
import { widgetMainRect } from '../widget-main-rect';
import { usePopOutWindows } from './behavior/usePopOutWindows';
import { useLegacyWidgetContext } from './behavior/useLegacyWidgetContext';
import { useWidgetGates } from './behavior/useWidgetGates';
import { useDisabledWidgets } from './behavior/useDisabledWidgets';
import { openSettingTarget } from '../../search/open-setting-target';
import { useKitSplit } from './behavior/useKitSplit';
import { useKitStage } from './behavior/useKitStage';
import { useWidgetContent } from './behavior/useWidgetContent';
import { useWidgetPersistence } from './behavior/useWidgetPersistence';
import { useWidgetLayoutGlobal } from './behavior/useWidgetLayoutGlobal';
import { useWidgetRelayPublisher } from './behavior/useWidgetRelayPublisher';
import { useWidgetsNeverFocus } from './behavior/useWidgetsNeverFocus';
import type { WidgetHostProps } from './WidgetHost.type';

const trackMainRect = (rect: Rect | null): void => {
  widgetMainRect.current = rect;
};

const WidgetHost = (props: WidgetHostProps) => {
  const { widgets = NO_WIDGETS, widgetKits = NO_KITS, main, mainLabel, widgetContext, layout: preset = null, keepFocusWithApp = true, widgetDisabled } = props;
  const registered = useWidgetRegistryStore((s) => s.registered);
  const all = useMemo(() => uniqueById([...BUILT_IN_WIDGETS, ...widgets, ...registered]), [widgets, registered]);
  const definitions = useKitSplit(all, widgetKits);
  const profileId = useProfilesStore((s) => s.active?.id ?? null);
  const layout = useWidgetLayoutStore((s) => s.layout);
  const setLayout = useWidgetLayoutStore((s) => s.setLayout);
  const externalDrag = useWidgetLayoutStore((s) => s.externalDrag);
  const settingsStore = useContext(SettingsStoreContext);
  const legacy = useLegacyWidgetContext(widgetContext);
  const gates = useWidgetGates(definitions, legacy);
  const resolveDisabled = useDisabledWidgets(widgetDisabled);
  const { content, settingsContent, toolsOf } = useWidgetContent(all);
  const extraOf = useCallback((id: string): Partial<WidgetWindowOpen> => ({ taskbar: getWidgetDefinition(definitions, id)?.taskbar === true }), [definitions]);

  const popOut = useCallback((id: string, point?: ScreenPoint) => popOutWindow(useWidgetLayoutStore.getState().layout, gates, id, extraOf(id), point), [gates, extraOf]);
  const stage = useKitStage({
    definitions, layout, onLayoutChange: setLayout, contextActive: gates.contextActive, pageOpen: gates.pageOpen, onPopOut: popOut, externalDrag, children: content, settingsContent,
  }, extraOf);
  const shown = useMemo(() => (stage.open ? stage.popped : poppedShown(layout, gates)), [stage.open, stage.popped, layout, gates]);
  const staged = <>{main}{stage.layer}</>;

  useEffect(() => useWidgetLayoutStore.getState().setPreset(preset), [preset]);
  useEffect(() => dragRelease.watch(window), []);
  useWidgetPersistence(profileId);
  usePopOutWindows(shown, extraOf);
  useWidgetRelayPublisher(settingsStore);
  useWidgetLayoutGlobal();
  useWidgetsNeverFocus(keepFocusWithApp);

  const dropIn = useCallback(() => useWidgetLayoutStore.getState().setExternalDrag(null), []);

  return (
    <WidgetManager
      {...stage.props}
      main={staged}
      mainLabel={mainLabel}
      mainGrip="dragging"
      onMainRect={trackMainRect}
      floatingMin={FLOATING_MIN}
      onExternalDrop={dropIn}
      developerToolsEnabled={gates.developerToolsEnabled}
      widgetActions={toolsOf}
      resolveDisabled={resolveDisabled} onOpenSettings={openSettingTarget}
    />
  );
};

export { WidgetHost };
