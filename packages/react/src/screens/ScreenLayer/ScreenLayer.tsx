/* @layer renderer-shell @kind component */
import { FullScreenLayer } from '@drizztdourden08/tessera/composites';
import type { ScreenLayerProps } from './ScreenLayer.type';
import './ScreenLayer.css';

const ScreenLayer = (props: ScreenLayerProps) => {
  const { title, subtitle, extra, floating, hidden, onClose, children } = props;
  return (
    <FullScreenLayer title={title} subtitle={subtitle} extra={extra} floating={floating} hidden={hidden} onClose={onClose}>
      {children}
    </FullScreenLayer>
  );
};

export { ScreenLayer };
