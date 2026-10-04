/* @layer renderer-shell @kind component */
import { useRef } from 'react';
import { Box } from '@drizztdourden08/tessera/primitives';
import { ScreenPage, ScreenWindow } from '@drizztdourden08/tessera/composites';
import { BackTitle } from '../../navigation/BackTitle';
import { useLayerFocus } from './behavior/useLayerFocus';
import type { ScreenLayerProps } from './ScreenLayer.type';

const ScreenLayer = (props: ScreenLayerProps) => {
  const { title, icon, header = 'page', subtitle, extra, floating, hidden = false, square, onBack, onClose, children } = props;
  const marker = useRef<HTMLElement>(null);
  useLayerFocus(marker, hidden);
  return (
    <ScreenWindow title={onBack ? <BackTitle title={title} onBack={onBack} /> : title} subtitle={subtitle} extra={extra} floating={floating} hidden={hidden} square={square} onClose={onClose}>
      <Box ref={marker} hidden aria-hidden />
      {header === 'page' ? <ScreenPage icon={icon} title={title}>{children}</ScreenPage> : children}
    </ScreenWindow>
  );
};

export { ScreenLayer };
