/* @layer renderer-shell @kind component */
import { useCallback, useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';
import { WidgetManager, getWidgetDefinition } from '@drizztdourden08/tessera/composites';
import type { Rect } from '@drizztdourden08/tessera/composites';
import { uniqueById } from '../../collections/unique-by-id';
import { useNavigationStore } from '../../navigation/useNavigationStore';
import { useDeveloperTools } from '../../app/useDeveloperTools';
import { useProfilesStore } from '../../stores/useProfilesStore';
import { BUILT_IN_WIDGETS } from '../built-in-widgets.constants';
import { NO_WIDGETS } from '../widget.constants';
import { poppedWindows } from '../popped-windows';
import { useWidgetLayoutStore } from '../useWidgetLayoutStore';
import { useWidgetRegistryStore } from '../useWidgetRegistryStore';
import { widgetMainRect } from '../widget-main-rect';
import { usePopOutWindows } from './behavior/usePopOutWindows';
import { useWidgetPersistence } from './behavior/useWidgetPersistence';
import { useWidgetRelayPublisher } from './behavior/useWidgetRelayPublisher';
import type { WidgetHostProps } from './WidgetHost.type';

const trackMainRect = (rect: Rect | null): void => {
  widgetMainRect.current = rect;
};

const WidgetHost = (props: WidgetHostProps) => {
  const { widgets = NO_WIDGETS, main } = props;
  const registered = useWidgetRegistryStore((s) => s.registered);
  const definitions = useMemo(() => uniqueById([...BUILT_IN_WIDGETS, ...widgets, ...registered]), [widgets, registered]);
  const profileId = useProfilesStore((s) => s.active?.id ?? null);
  const layout = useWidgetLayoutStore((s) => s.layout);
  const setLayout = useWidgetLayoutStore((s) => s.setLayout);
  const externalDrag = useWidgetLayoutStore((s) => s.externalDrag);
  const pageOpen = useNavigationStore((s) => s.active !== null);
  const developerTools = useDeveloperTools();

  useEffect(() => useWidgetLayoutStore.getState().setDefinitions(definitions), [definitions]);
  useWidgetPersistence(profileId);
  usePopOutWindows();
  useWidgetRelayPublisher();

  const content = useMemo<Record<string, ReactNode>>(
    () => Object.fromEntries(definitions.map((def) => [def.id, def.render()])),
    [definitions],
  );
  const settingsContent = useMemo<Record<string, ReactNode>>(
    () => Object.fromEntries(definitions.flatMap((def) => (def.settings ? [[def.id, def.settings()]] : []))),
    [definitions],
  );

  const popOut = useCallback((id: string) => {
    const memory = useWidgetLayoutStore.getState().layout.poppedMemory?.[id];
    if (getWidgetDefinition(definitions, id)?.popOut === true) poppedWindows.open({ ...memory, id });
  }, [definitions]);
  const dropIn = useCallback(() => useWidgetLayoutStore.getState().setExternalDrag(null), []);

  return (
    <WidgetManager
      definitions={definitions}
      layout={layout}
      onLayoutChange={setLayout}
      main={main}
      onMainRect={trackMainRect}
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
