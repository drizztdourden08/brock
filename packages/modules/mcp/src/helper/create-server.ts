/* @layer mcp-helper @kind logic */
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { callTool } from './call-tool';
import { HELPER_INFO, HELPER_TEXT } from './helper.constants';
import type { AppLink, TargetOptions } from './helper.type';
import { helperLog } from './helper-log';
import { listTools } from './list-tools';
import { toCallResult } from './to-call-result';

const createServer = (link: AppLink, options: TargetOptions): Server => {
  const server = new Server(HELPER_INFO, { capabilities: { tools: { listChanged: true } }, instructions: HELPER_TEXT.instructions });
  server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: await listTools(link) }));
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const started = Date.now();
    const result = await callTool(link, options, request.params.name, request.params.arguments);
    helperLog(`${request.params.name} ${result.isError ? 'failed' : 'ok'} in ${Date.now() - started} ms`);
    return toCallResult(result);
  });
  link.onToolsChanged(() => void server.sendToolListChanged().catch(() => undefined));
  return server;
};

export { createServer };
