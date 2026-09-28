/* @layer renderer-shell @kind component */
import { useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';
import { WidgetManager } from '@drizztdourden08/tessera/composites';
import { uniqueById } from '../../collections/unique-by-id';
import { useNavigationStore } from '../../navigation/useNavigationStore';
import { useCapability } from '../../platform/useCapability';
import { useDeveloperTools } from '../../app/useDeveloperTools';
import { useProfilesStore } from '../../stores/useProfilesStore';
import { BUILT_IN_WIDGETS } from '../built-in-widgets.constants';
import { NO_WIDGETS, WIDGET_TOP_OFFSET } from '../widget.constants';
import { useWidgetLayoutStore } from '../useWidgetLayoutStore';
import { useWidgetRegistryStore } from '../useWidgetRegistryStore';
import { useWidgetPersistence } from './behavior/useWidgetPersistence';
import type { WidgetHostProps } from './WidgetHost.type';

const WidgetHost = (props: WidgetHostProps) => {
  const { widgets = NO_WIDGETS } = props;
  const registered = useWidgetRegistryStore((s) => s.registered);
  const definitions = useMemo(() => uniqueById([...BUILT_IN_WIDGETS, ...widgets, ...registered]), [widgets, registered]);
  const profileId = useProfilesStore((s) => s.active?.id ?? null);
  const layout = useWidgetLayoutStore((s) => s.layout);
  const update = useWidgetLayoutStore((s) => s.update);
  const close = useWidgetLayoutStore((s) => s.close);
  const pageOpen = useNavigationStore((s) => s.active !== null);
  const windowChrome = useCapability('windowChrome');
  const developerTools = useDeveloperTools();

  useEffect(() => useWidgetLayoutStore.getState().setDefinitions(definitions), [definitions]);
  useWidgetPersistence(profileId);

  const content = useMemo<Record<string, ReactNode>>(
    () => Object.fromEntries(definitions.map((def) => [def.id, def.render()])),
    [definitions],
  );
  const settingsContent = useMemo<Record<string, ReactNode>>(
    () => Object.fromEntries(definitions.flatMap((def) => (def.settings ? [[def.id, def.settings()]] : []))),
    [definitions],
  );

  return (
    <WidgetManager
      definitions={definitions}
      layout={layout}
      contextActive
      pageOpen={pageOpen}
      onUpdate={update}
      onClose={close}
      settingsContent={settingsContent}
      developerToolsEnabled={developerTools}
      topOffset={windowChrome ? WIDGET_TOP_OFFSET : 0}
    >
      {content}
    </WidgetManager>
  );
};

export { WidgetHost };
