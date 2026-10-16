/* @layer renderer-shell @kind component */
import { Box } from '@drizztdourden08/tessera/primitives';
import { RenderErrorBoundary } from '../../../errors/RenderErrorBoundary';
import { LazyHost } from '../../../lazy/LazyHost';
import { widgetErrorLabel } from '../../widget-error-label';
import type { KitOverlayProps } from '../KitLayer.type';

const KitOverlay = (props: KitOverlayProps) => {
  const { overlay } = props;
  return (
    <Box className="widget-kit-layer__overlay" data-kit-overlay={overlay.id}>
      <RenderErrorBoundary scope={`Overlay ${overlay.id}`} label={widgetErrorLabel(overlay.label)}><LazyHost>{overlay.render()}</LazyHost></RenderErrorBoundary>
    </Box>
  );
};

export { KitOverlay };
