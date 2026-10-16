/* @layer renderer-shell @kind component */
import type { ReactNode } from 'react';
import { ScreenPage, ScreenWindow } from '@drizztdourden08/tessera/composites';
import { ScrollArea } from '@drizztdourden08/tessera/primitives';
import type { ScreenLayerProps } from './ScreenLayer.type';
import './ScreenLayer.css';

const bodyOf = (props: ScreenLayerProps): ReactNode => {
  const { icon, title, header = 'page', size, children } = props;
  if (header === 'page') return <ScreenPage icon={icon} title={title}>{children}</ScreenPage>;
  return size === 'info' ? <ScrollArea className="brock-info-card">{children}</ScrollArea> : children;
};

const ScreenLayer = (props: ScreenLayerProps) => {
  const { title, subtitle, extra, floating, hidden = false, size, square, back, onClose } = props;
  return (
    <ScreenWindow title={title} subtitle={subtitle} extra={extra} floating={floating} hidden={hidden} size={size} square={square} back={back} onClose={onClose}>
      {bodyOf(props)}
    </ScreenWindow>
  );
};

export { ScreenLayer };
