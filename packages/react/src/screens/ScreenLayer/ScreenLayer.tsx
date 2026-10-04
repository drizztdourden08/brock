/* @layer renderer-shell @kind component */
import { ScreenPage, ScreenWindow } from '@drizztdourden08/tessera/composites';
import type { ScreenLayerProps } from './ScreenLayer.type';

const ScreenLayer = (props: ScreenLayerProps) => {
  const { title, icon, header = 'page', subtitle, extra, floating, hidden, square, onClose, children } = props;
  return (
    <ScreenWindow title={title} subtitle={subtitle} extra={extra} floating={floating} hidden={hidden} square={square} onClose={onClose}>
      {header === 'page' ? <ScreenPage icon={icon} title={title}>{children}</ScreenPage> : children}
    </ScreenWindow>
  );
};

export { ScreenLayer };
