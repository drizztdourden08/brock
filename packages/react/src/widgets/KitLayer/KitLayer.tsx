/* @layer renderer-shell @kind component */
import { Box } from '@drizztdourden08/tessera/primitives';
import { NO_OVERLAYS } from '../kits/widget-kit.constants';
import { KitBar } from './sub-components/KitBar';
import { KitOverlay } from './sub-components/KitOverlay';
import { KitWaiting } from './sub-components/KitWaiting';
import type { KitLayerProps } from './KitLayer.type';
import './KitLayer.css';

const KitLayer = (props: KitLayerProps) => {
  const { kit, hidden, reason, onClose } = props;
  const overlays = reason === null ? (kit.overlays ?? NO_OVERLAYS).filter((overlay) => !hidden.includes(overlay.id)) : NO_OVERLAYS;
  return (
    <Box className="widget-kit-layer" data-widget-kit={kit.id}>
      {overlays.map((overlay) => <KitOverlay key={overlay.id} overlay={overlay} />)}
      {reason !== null && <KitWaiting kit={kit} reason={reason} onClose={onClose} />}
      <KitBar kit={kit} onClose={onClose} />
    </Box>
  );
};

export { KitLayer };
