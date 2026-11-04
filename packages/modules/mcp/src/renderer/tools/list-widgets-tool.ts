/* @layer renderer-shell @kind logic */
import { widgets } from '@drizztdourden08/brock-react';
import type { WidgetSnapshot } from '@drizztdourden08/brock-react';
import { defineMcpTool } from '../../define-mcp-tool';
import type { McpData } from '../../mcp.type';
import { descriptorOf } from './descriptor-of';

const widgetEntryOf = (widget: WidgetSnapshot): McpData => ({
  id: widget.id,
  label: widget.label,
  visible: widget.visible,
  available: widget.available,
  popped: widget.popped,
});

const listWidgetsTool = defineMcpTool({
  ...descriptorOf('list_widgets'),
  run: () => ({ data: { widgets: widgets.list().map(widgetEntryOf) } }),
});

export { listWidgetsTool };
