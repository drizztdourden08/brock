/* @layer renderer-shell @kind component */
import { Box } from '@drizztdourden08/tessera/primitives';
import { contextMenuZone } from '../../context-menu/context-menu-zone';
import { TOOLBAR_ZONE } from '../toolbar.constants';
import type { ToolbarZoneProps } from './ToolbarZone.type';
import './ToolbarZone.css';

const ToolbarZone = ({ id, children }: ToolbarZoneProps) => (
  <Box className="toolbar-zone" {...contextMenuZone(TOOLBAR_ZONE, { data: id })}>{children}</Box>
);

export { ToolbarZone };
