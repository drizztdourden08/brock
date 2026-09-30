/* @layer renderer-shell @kind component */
import { useCallback, useMemo, useState } from 'react';
import { Box } from '@drizztdourden08/tessera/primitives';
import { Widget, createDefaultLayout, frameOf, getWidgetDefinition } from '@drizztdourden08/tessera/composites';
import type { WidgetLayout } from '@drizztdourden08/tessera/composites';
import { uniqueById } from '../../collections/unique-by-id';
import { hostApi } from '../../host/host-api';
import { BUILT_IN_WIDGETS } from '../built-in-widgets.constants';
import { NO_WIDGETS, RELAY_SLICES } from '../widget.constants';
import { useWidgetRegistryStore } from '../useWidgetRegistryStore';
import { useWidgetRelayStore } from '../useWidgetRelayStore';
import { usePoppedWindowState } from './behavior/usePoppedWindowState';
import { useWidgetRelay } from './behavior/useWidgetRelay';
import { WidgetWindowOptions } from './sub-components/WidgetWindowOptions';
import type { WidgetWindowProps } from './WidgetWindow.type';
import './WidgetWindow.css';

const noop = (): void => undefined;

const WidgetWindow = (props: WidgetWindowProps) => {
  const { id, widgets = NO_WIDGETS } = props;
  const registered = useWidgetRegistryStore((s) => s.registered);
  const definition = useMemo(() => getWidgetDefinition(uniqueById([...BUILT_IN_WIDGETS, ...widgets, ...registered]), id), [widgets, registered, id]);
  const frames = useWidgetRelayStore((s) => s.slices[RELAY_SLICES.frames]) as WidgetLayout['frame'] | undefined;
  const own = usePoppedWindowState(id);
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  useWidgetRelay(id);

  const frame = frameOf({ ...createDefaultLayout(), frame: frames ?? {} }, id, definition);
  const tabs = useMemo(() => [{ id, label: definition?.label ?? id }], [id, definition]);
  const popIn = useCallback(() => hostApi()?.dockBackWidget(id), [id]);
  const close = useCallback(() => hostApi()?.dockBackWidget(id, 'close'), [id]);
  const toggleOptions = useCallback((next: HTMLElement) => setAnchor((current) => (current ? null : next)), []);

  return (
    <Box className="widget-window">
      <Widget
        id={id}
        tabs={tabs}
        activeId={id}
        paneKey={null}
        mode="out"
        opacity={frame.opacity}
        optionsOpen={anchor !== null}
        pin={own.pin}
        onTop={own.onTop}
        onPinChange={own.setPin}
        onActivateTab={noop}
        onOpenOptions={toggleOptions}
        onPopOut={popIn}
        canPopOut
        onClose={close}
      >
        {definition?.render()}
      </Widget>
      {anchor && (
        <WidgetWindowOptions id={id} definition={definition} anchor={anchor} frame={frame} own={own} onClose={() => setAnchor(null)} />
      )}
    </Box>
  );
};

export { WidgetWindow };
