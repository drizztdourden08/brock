/* @layer renderer-shell @kind logic */
import type { McpToolDef } from '../../mcp.type';
import { listCommandsTool } from './list-commands-tool';
import { listWidgetsTool } from './list-widgets-tool';
import { openWidgetTool } from './open-widget-tool';
import { readUiTool } from './read-ui-tool';
import { runCommandTool } from './run-command-tool';

const RENDERER_TOOLS: readonly McpToolDef[] = [listWidgetsTool, openWidgetTool, listCommandsTool, runCommandTool, readUiTool];

export { RENDERER_TOOLS };
