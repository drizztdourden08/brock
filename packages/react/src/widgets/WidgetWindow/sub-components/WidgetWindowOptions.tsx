/* @layer renderer-shell @kind component */
import type { WidgetDockBack, WidgetFrameWire } from '@drizztdourden08/brock-core';
import { WidgetOptions, createDefaultLayout, frameOf } from '@drizztdourden08/tessera/composites';
import { hostApi } from '../../../host/host-api';
import { WidgetIdContext } from '../../widget-id-context';
import type { WidgetWindowOptionsProps } from '../WidgetWindow.type';

const noop = (): void => undefined;

const WidgetWindowOptions = (props: WidgetWindowOptionsProps) => {
  const { id, definition, frame, own, defaultOpen } = props;
  const back = (where?: WidgetDockBack): void => hostApi()?.dockBackWidget(id, where);
  const setFrame = (patch: Partial<WidgetFrameWire>): void => hostApi()?.setWidgetFrame(id, patch);

  const reset = (): void => {
    setFrame(frameOf(createDefaultLayout(), id, definition));
    own.setPin('off');
    own.setSnap(true);
    own.setSync(true);
  };

  return (
    <WidgetOptions
      title={definition?.label ?? id}
      placement="popped"
      makeRoom={false}
      opacity={frame.opacity}
      show={frame.show}
      defaultOpen={defaultOpen}
      onDock={(edge) => back(edge)}
      onFloat={() => back('float')}
      onPopOut={() => back()}
      canPopOut
      pin={own.pin}
      onPinChange={own.setPin}
      snap={own.snap}
      onSnapChange={own.setSnap}
      sync={own.sync}
      onSyncChange={own.setSync}
      onMakeRoomChange={noop}
      onOpacityChange={(value) => setFrame({ opacity: value })}
      onShowChange={(value) => setFrame({ show: value })}
      onReset={reset}
    >
      {definition?.settings && <WidgetIdContext.Provider value={id}>{definition.settings()}</WidgetIdContext.Provider>}
    </WidgetOptions>
  );
};

export { WidgetWindowOptions };
