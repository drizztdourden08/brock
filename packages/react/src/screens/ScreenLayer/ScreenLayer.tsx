/* @layer renderer-shell @kind component */
import { ScreenPage, ScreenWindow } from '@drizztdourden08/tessera/composites';
import type { ScreenLayerProps } from './ScreenLayer.type';

const ScreenLayer = (props: ScreenLayerProps) => {
  const { title, icon, header = 'page', subtitle, extra, floating, hidden = false, square, back, onClose, children } = props;
  return (
    <ScreenWindow title={title} subtitle={subtitle} extra={extra} floating={floating} hidden={hidden} square={square} back={back} onClose={onClose}>
      {header === 'page' ? <ScreenPage icon={icon} title={title}>{children}</ScreenPage> : children}
    </ScreenWindow>
  );
};

export { ScreenLayer };
