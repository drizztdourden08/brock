/* @layer renderer-shell @kind logic */
import { nav } from '@drizztdourden08/brock-react';
import { defineMcpTool } from '../../define-mcp-tool';
import { argsReader } from './args-reader';
import { collectUiNodes } from './collect-ui-nodes';
import { descriptorOf } from './descriptor-of';
import { READ_UI_MAX_DEFAULT } from './read-ui.constants';

const readUiTool = defineMcpTool({
  ...descriptorOf('read_ui'),
  run: (args) => {
    const query = (argsReader.text(args, 'query') ?? '').trim().toLowerCase();
    const { nodes, truncated } = collectUiNodes(document, query, argsReader.count(args, 'max') ?? READ_UI_MAX_DEFAULT);
    return { data: { route: nav.active(), nodes, truncated } };
  },
});

export { readUiTool };
