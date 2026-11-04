/* @layer electron-main @kind logic */
import type { McpMain } from './mcp-main.type';

const mcpInstances = new WeakMap<object, McpMain>();

export { mcpInstances };
