/* @layer renderer-shell @kind component */
import type { ReactNode } from 'react';
import { ScreenWindow } from '@drizztdourden08/tessera/composites';
import { ScrollArea, Text } from '@drizztdourden08/tessera/primitives';
import { HEADED } from './ScreenLayer.constants';
import type { ScreenLayerProps } from './ScreenLayer.type';
import './ScreenLayer.css';

const bodyOf = (props: ScreenLayerProps): ReactNode => {
  const { header = 'page', size, children } = props;
  if (header === 'page') return <ScrollArea className="brock-page-body" gutter="stable">{children}</ScrollArea>;
  return size === 'info' ? <ScrollArea className="brock-info-card" gutter="stable">{children}</ScrollArea> : children;
};

const actionsOf = ({ subtitle, extra }: ScreenLayerProps): ReactNode => (
  <>
    {subtitle != null && <Text className="brock-page-subtitle">{subtitle}</Text>}
    {extra}
  </>
);

const frameOf = (props: ScreenLayerProps) => {
  if (props.free !== undefined) return { titleRow: false, movable: true, storageKey: props.free, icon: props.icon, cornerTitle: props.cornerTitle };
  return HEADED.has(props.header ?? 'page') ? { header: { icon: props.icon, actions: actionsOf(props) } } : {};
};

const ScreenLayer = (props: ScreenLayerProps) => {
  const { title, subtitle, extra, floating, hidden = false, size, square, back, onClose } = props;
  return (
    <ScreenWindow {...frameOf(props)} title={title} subtitle={subtitle} extra={extra} floating={floating} hidden={hidden} size={size} square={square} back={back} onClose={onClose}>
      {bodyOf(props)}
    </ScreenWindow>
  );
};

export { ScreenLayer };
