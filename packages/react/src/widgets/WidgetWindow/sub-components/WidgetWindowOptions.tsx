/* @layer renderer-shell @kind component */
import { useMemo } from 'react';
import type { WidgetDockBack, WidgetFrameWire } from '@drizztdourden08/brock-core';
import { WidgetOptions, createDefaultLayout, frameOf } from '@drizztdourden08/tessera/composites';
import { hostApi } from '../../../host/host-api';
import { WINDOW_GROUPS } from '../../window-groups.constants';
import { WindowGroupControls } from '../../WindowGroupControls';
import type { WidgetWindowOptionsProps } from '../WidgetWindow.type';
import { PinChoiceRow } from './PinChoiceRow';

const noop = (): void => undefined;

const WidgetWindowOptions = (props: WidgetWindowOptionsProps) => {
  const { id, definition, anchor, frame, own, onClose } = props;
  const anchorRef = useMemo(() => ({ current: anchor }), [anchor]);
  const back = (where?: WidgetDockBack): void => hostApi()?.dockBackWidget(id, where);
  const setFrame = (patch: Partial<WidgetFrameWire>): void => hostApi()?.setWidgetFrame(id, patch);

  const reset = (): void => {
    setFrame(frameOf(createDefaultLayout(), id, definition));
    own.setPin('off');
    own.setSnap(true);
    own.setSync(true);
    own.setGroup(null);
    onClose();
  };

  return (
    <WidgetOptions
      title={definition?.label ?? id}
      placement="popped"
      makeRoom={false}
      opacity={frame.opacity}
      show={frame.show}
      anchorRef={anchorRef}
      onDock={(edge) => back(edge)}
      onFloat={() => back('float')}
      onPopOut={() => back()}
      canPopOut
      snap={own.snap}
      onSnapChange={own.setSnap}
      onMakeRoomChange={noop}
      onOpacityChange={(value) => setFrame({ opacity: value })}
      onShowChange={(value) => setFrame({ show: value })}
      onReset={reset}
      onClose={onClose}
    >
      <PinChoiceRow pin={own.pin} onPinChange={own.setPin} />
      <WindowGroupControls
        sync={own.sync}
        onSyncChange={own.setSync}
        windowGroup={own.group}
        windowGroups={WINDOW_GROUPS}
        onWindowGroupChange={own.setGroup}
      />
      {definition?.settings?.()}
    </WidgetOptions>
  );
};

export { WidgetWindowOptions };
