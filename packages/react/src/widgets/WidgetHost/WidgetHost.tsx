/* @layer renderer-shell @kind component */
import { useCallback, useContext, useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { WidgetWindowOpen } from '@drizztdourden08/brock-core';
import { WidgetManager, getWidgetDefinition } from '@drizztdourden08/tessera/composites';
import type { Rect, ScreenPoint, WidgetGates } from '@drizztdourden08/tessera/composites';
import { uniqueById } from '../../collections/unique-by-id';
import { useNavigationStore } from '../../navigation/useNavigationStore';
import { useDeveloperTools } from '../../app/useDeveloperTools';
import { SettingsStoreContext } from '../../stores/settings-context';
import { useProfilesStore } from '../../stores/useProfilesStore';
import { BUILT_IN_WIDGETS } from '../built-in-widgets.constants';
import { dragRelease } from '../drag-release';
import { FLOATING_MIN, NO_IDS, NO_WIDGETS } from '../widget.constants';
import { poppedShown } from '../popped-shown';
import { poppedWindows } from '../popped-windows';
import { useWidgetLayoutStore } from '../useWidgetLayoutStore';
import { useWidgetRegistryStore } from '../useWidgetRegistryStore';
import { widgetMainRect } from '../widget-main-rect';
import { usePopOutWindows } from './behavior/usePopOutWindows';
import { useWidgetPersistence } from './behavior/useWidgetPersistence';
import { useWidgetLayoutGlobal } from './behavior/useWidgetLayoutGlobal';
import { useWidgetRelayPublisher } from './behavior/useWidgetRelayPublisher';
import type { WidgetHostProps } from './WidgetHost.type';

const trackMainRect = (rect: Rect | null): void => {
  widgetMainRect.current = rect;
};

const dragOutPlace = (point?: ScreenPoint): Partial<WidgetWindowOpen> =>
  (point ? { at: { x: point.screenX, y: point.screenY } } : { atCursor: dragRelease.releasing() });

const WidgetHost = (props: WidgetHostProps) => {
  const { widgets = NO_WIDGETS, main, mainLabel } = props;
  const registered = useWidgetRegistryStore((s) => s.registered);
  const definitions = useMemo(() => uniqueById([...BUILT_IN_WIDGETS, ...widgets, ...registered]), [widgets, registered]);
  const profileId = useProfilesStore((s) => s.active?.id ?? null);
  const layout = useWidgetLayoutStore((s) => s.layout);
  const setLayout = useWidgetLayoutStore((s) => s.setLayout);
  const externalDrag = useWidgetLayoutStore((s) => s.externalDrag);
  const pageOpen = useNavigationStore((s) => s.active !== null);
  const developerTools = useDeveloperTools();
  const settingsStore = useContext(SettingsStoreContext);
  const gates = useMemo<WidgetGates>(() => ({
    definitions, developerToolsEnabled: developerTools, contextActive: true, pageOpen, forcedIds: NO_IDS, contentIds: definitions.map((def) => def.id),
  }), [definitions, developerTools, pageOpen]);
  const shown = useMemo(() => poppedShown(layout, gates), [layout, gates]);
  const extraOf = useCallback((id: string): Partial<WidgetWindowOpen> => ({ taskbar: getWidgetDefinition(definitions, id)?.taskbar === true }), [definitions]);

  useEffect(() => useWidgetLayoutStore.getState().setDefinitions(definitions), [definitions]);
  useEffect(() => dragRelease.watch(window), []);
  useWidgetPersistence(profileId);
  usePopOutWindows(shown, extraOf);
  useWidgetRelayPublisher(settingsStore);
  useWidgetLayoutGlobal();

  const content = useMemo<Record<string, ReactNode>>(
    () => Object.fromEntries(definitions.map((def) => [def.id, def.render()])),
    [definitions],
  );
  const settingsContent = useMemo<Record<string, ReactNode>>(
    () => Object.fromEntries(definitions.flatMap((def) => (def.settings ? [[def.id, def.settings()]] : []))),
    [definitions],
  );

  const popOut = useCallback((id: string, point?: ScreenPoint) => {
    const current = useWidgetLayoutStore.getState().layout;
    const facts = { ...current.poppedMemory?.[id], id };
    if (poppedShown({ ...current, popped: [facts] }, gates).length === 0) return;
    poppedWindows.open(facts, { ...extraOf(id), ...dragOutPlace(point) });
  }, [gates, extraOf]);
  const dropIn = useCallback(() => useWidgetLayoutStore.getState().setExternalDrag(null), []);

  return (
    <WidgetManager
      definitions={definitions}
      layout={layout}
      onLayoutChange={setLayout}
      main={main}
      mainLabel={mainLabel}
      mainGrip="dragging"
      onMainRect={trackMainRect}
      floatingMin={FLOATING_MIN}
      onPopOut={popOut}
      externalDrag={externalDrag}
      onExternalDrop={dropIn}
      contextActive
      pageOpen={pageOpen}
      settingsContent={settingsContent}
      developerToolsEnabled={developerTools}
    >
      {content}
    </WidgetManager>
  );
};

export { WidgetHost };
