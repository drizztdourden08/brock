/* @layer mcp-helper @kind logic */
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import type { McpToolResult } from '../mcp.type';

const toCallResult = (result: McpToolResult): CallToolResult => {
  const text = result.text === '' ? [] : [{ type: 'text' as const, text: result.text }];
  const images = result.images.map((image) => ({ type: 'image' as const, data: image.data, mimeType: image.mimeType }));
  return {
    content: [...text, ...images],
    ...(result.data === undefined ? {} : { structuredContent: result.data }),
    ...(result.isError ? { isError: true } : {}),
  };
};

export { toCallResult };
