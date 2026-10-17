/* @layer renderer-shell @kind component */
import type { ReactNode } from 'react';
import { ScreenPage, ScreenWindow } from '@drizztdourden08/tessera/composites';
import { ScrollArea } from '@drizztdourden08/tessera/primitives';
import { WindowMascot } from '../../brand/WindowMascot';
import type { ScreenLayerProps } from './ScreenLayer.type';
import './ScreenLayer.css';

const bodyOf = (props: ScreenLayerProps): ReactNode => {
  const { icon, title, header = 'page', size, children } = props;
  if (header === 'page') return <ScreenPage icon={icon} title={title}>{children}</ScreenPage>;
  return size === 'info' ? <ScrollArea className="brock-info-card">{children}</ScrollArea> : children;
};

const frameOf = ({ free }: ScreenLayerProps) => (free === undefined ? {} : { titleRow: false, movable: true, storageKey: free });

const ScreenLayer = (props: ScreenLayerProps) => {
  const { title, subtitle, extra, floating, hidden = false, size, square, back, onClose } = props;
  return (
    <ScreenWindow {...frameOf(props)} title={title} subtitle={subtitle} extra={extra} floating={floating} hidden={hidden} size={size} square={square} back={back} onClose={onClose}>
      {bodyOf(props)}
      {!hidden && <WindowMascot />}
    </ScreenWindow>
  );
};

export { ScreenLayer };
