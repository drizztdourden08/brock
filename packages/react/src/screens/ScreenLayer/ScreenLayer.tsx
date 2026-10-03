/* @layer renderer-shell @kind component */
import { ScreenWindow } from '@drizztdourden08/tessera/composites';
import type { ScreenLayerProps } from './ScreenLayer.type';

const ScreenLayer = (props: ScreenLayerProps) => {
  const { title, subtitle, extra, floating, hidden, onClose, children } = props;
  return (
    <ScreenWindow title={title} subtitle={subtitle} extra={extra} floating={floating} hidden={hidden} onClose={onClose}>
      {children}
    </ScreenWindow>
  );
};

export { ScreenLayer };
