/* @layer renderer-shell @kind component */
import { Box } from '@drizztdourden08/tessera/primitives';
import { RenderErrorBoundary } from '../../../errors/RenderErrorBoundary';
import { LazyHost } from '../../../lazy/LazyHost';
import { useBodyMounted } from '../../../screenshot/useBodyMounted';
import { widgetBodyHolds } from '../../widget-body-holds';
import { useWidgetErrorLabel } from '../../useWidgetErrorLabel';
import type { KitOverlayProps } from '../KitLayer.type';

const KitOverlay = (props: KitOverlayProps) => {
  const { overlay } = props;
  const errorLabel = useWidgetErrorLabel();
  useBodyMounted(widgetBodyHolds.overlayKey(overlay.id));
  return (
    <Box className="widget-kit-layer__overlay" data-kit-overlay={overlay.id}>
      <RenderErrorBoundary scope={`Overlay ${overlay.id}`} label={errorLabel(overlay.label)}><LazyHost>{overlay.render()}</LazyHost></RenderErrorBoundary>
    </Box>
  );
};

export { KitOverlay };
