/* @layer renderer-shell @kind component */
import { useCallback, useMemo } from 'react';
import { Box } from '@drizztdourden08/tessera/primitives';
import { Widget, createDefaultLayout, frameOf, getWidgetDefinition } from '@drizztdourden08/tessera/composites';
import type { WidgetLayout } from '@drizztdourden08/tessera/composites';
import { uniqueById } from '../../collections/unique-by-id';
import { hostApi } from '../../host/host-api';
import { StandardOverlays } from '../../overlays/StandardOverlays/StandardOverlays';
import { BUILT_IN_WIDGETS } from '../built-in-widgets.constants';
import { NO_WIDGETS, RELAY_SLICES } from '../widget.constants';
import { WidgetBody } from '../WidgetBody';
import { useWidgetRegistryStore } from '../useWidgetRegistryStore';
import { useWidgetRelayStore } from '../useWidgetRelayStore';
import { WindowGuide } from '../WindowGuide';
import { usePoppedWindowState } from './behavior/usePoppedWindowState';
import { useReviewOptions } from './behavior/useReviewOptions';
import { useWidgetRelay } from './behavior/useWidgetRelay';
import { useWidgetTourClick } from './behavior/useWidgetTourClick';
import { useWidgetWindowEscape } from './behavior/useWidgetWindowEscape';
import { WidgetTourSpot } from './sub-components/WidgetTourSpot';
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
  const reviewOpen = useReviewOptions(id);
  useWidgetRelay(id);
  useWidgetWindowEscape();
  useWidgetTourClick(id);

  const frame = frameOf({ ...createDefaultLayout(), frame: frames ?? {} }, id, definition);
  const label = definition?.label ?? id;
  const tabs = useMemo(() => [{ id, label }], [id, label]);
  const popIn = useCallback(() => hostApi()?.dockBackWidget(id), [id]);
  const close = useCallback(() => hostApi()?.dockBackWidget(id, 'close'), [id]);
  const options = (
    <WidgetWindowOptions key={reviewOpen ? 'review' : 'own'} id={id} definition={definition} frame={frame} own={own} defaultOpen={reviewOpen} />
  );

  return (
    <Box className="widget-window">
      <Widget
        id={id}
        tabs={tabs}
        activeId={id}
        paneKey={null}
        mode="out"
        dragRegion
        opacity={frame.opacity}
        square={own.square}
        padding={definition?.padding}
        fill={definition?.fill}
        pin={own.pin}
        onPinChange={own.setPin}
        options={options}
        onActivateTab={noop}
        onPopOut={popIn}
        canPopOut
        onClose={close}
      >
        <WidgetBody id={id} label={label}>{definition?.render()}</WidgetBody>
      </Widget>
      <WindowGuide />
      <WidgetTourSpot id={id} />
      <StandardOverlays />
    </Box>
  );
};

export { WidgetWindow };
