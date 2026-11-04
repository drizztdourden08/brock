/* @layer renderer-shell @kind logic */
import { widgets } from '@drizztdourden08/brock-react';
import { defineMcpTool } from '../../define-mcp-tool';
import { MCP_ERROR } from '../../mcp.constants';
import { toolFailure } from '../tool-failure';
import { argsReader } from './args-reader';
import { descriptorOf } from './descriptor-of';

const ACTIONS = new Map<string, (id: string) => void>([
  ['open', widgets.open],
  ['close', widgets.close],
  ['focus', widgets.focus],
]);

const openWidgetTool = defineMcpTool({
  ...descriptorOf('open_widget'),
  run: (args) => {
    const id = argsReader.text(args, 'id') ?? '';
    const act = ACTIONS.get(argsReader.text(args, 'action') ?? 'open');
    if (act === undefined) return toolFailure(MCP_ERROR.invalidArguments, 'The action is not open, close or focus.');
    if (!widgets.list().some((widget) => widget.id === id)) return toolFailure(MCP_ERROR.invalidArguments, `Unknown widget "${id}".`);
    act(id);
    return { data: { visible: widgets.isVisible(id) } };
  },
});

export { openWidgetTool };
