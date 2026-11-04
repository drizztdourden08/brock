/* @layer core @kind logic */
import type { McpToolDescriptor, McpToolInfo } from './mcp.type';
import { argJsonSchema } from './arg-json-schema';

const toolInfoOf = (tool: McpToolDescriptor): McpToolInfo => ({
  name: tool.name,
  title: tool.title ?? tool.name,
  description: tool.description,
  inputSchema: argJsonSchema(tool.args ?? {}),
  readOnly: tool.readOnly === true,
  destructive: tool.destructive === true,
});

export { toolInfoOf };
