/* @layer renderer-shell @kind component */
import { useRef } from 'react';
import { Box } from '@drizztdourden08/tessera/primitives';
import { useFileDropZone } from '../../../../file-drop';
import type { WidgetDropZoneProps } from './WidgetDropZone.type';
import './WidgetDropZone.css';

const WidgetDropZone = (props: WidgetDropZoneProps) => {
  const { drop, children } = props;
  const ref = useRef<HTMLElement>(null);
  useFileDropZone(ref, drop);
  return <Box ref={ref} className="widget-drop-zone">{children}</Box>;
};

export { WidgetDropZone };
