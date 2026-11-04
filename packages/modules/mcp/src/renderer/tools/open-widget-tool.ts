/* @layer renderer-shell @kind logic */
import { widgets } from '@drizztdourden08/brock-react';
import { defineMcpTool } from '../../define-mcp-tool';
import { MCP_ERROR } from '../../mcp.constants';
import { toolFailure } from '../tool-failure';
import { argsReader } from './args-reader';
import { descriptorOf } from './descriptor-of';
import { WIDGET_ACTIONS } from './open-widget-tool.constants';

const openWidgetTool = defineMcpTool({
  ...descriptorOf('open_widget'),
  run: (args) => {
    const id = argsReader.text(args, 'id') ?? '';
    const act = WIDGET_ACTIONS.get(argsReader.text(args, 'action') ?? 'open');
    if (act === undefined) return toolFailure(MCP_ERROR.invalidArguments, 'The action is not open, close or focus.');
    if (!widgets.list().some((widget) => widget.id === id)) return toolFailure(MCP_ERROR.invalidArguments, `Unknown widget "${id}".`);
    act(id);
    return { data: { visible: widgets.isVisible(id) } };
  },
});

export { openWidgetTool };
