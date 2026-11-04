/* @layer electron-main @kind logic */
import type { BridgeArgsCheck } from '@drizztdourden08/brock-electron/main';
import { MCP_CALL_NAME_MAX_CHARS } from './mcp-main.constants';

const isRecord = (value: unknown): boolean => value !== null && typeof value === 'object' && !Array.isArray(value);

const none: BridgeArgsCheck = (args) => args.length === 0;

const call: BridgeArgsCheck = ([name, args, ...rest]) =>
  rest.length === 0
  && typeof name === 'string'
  && name.length <= MCP_CALL_NAME_MAX_CHARS
  && (args === undefined || args === null || isRecord(args));

const routeChecks = { none, call };

export { routeChecks };
