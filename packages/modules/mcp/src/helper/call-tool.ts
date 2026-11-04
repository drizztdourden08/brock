/* @layer mcp-helper @kind logic */
import type { McpToolResult } from '../mcp.type';
import { bridgeFailure } from './bridge-failure';
import { checkRequestSize } from './check-request-size';
import { SELECT_APP_SPEC } from './helper.constants';
import type { AppLink, TargetOptions } from './helper.type';
import { jsonArgsOf } from './json-args-of';
import { selectApp } from './select-app-tool';

const callTool = async (link: AppLink, options: TargetOptions, name: string, raw: unknown): Promise<McpToolResult> => {
  const args = jsonArgsOf(raw);
  if (name === SELECT_APP_SPEC.name) return selectApp(link, args, options);
  const tooLarge = checkRequestSize(args);
  if (tooLarge !== null) return tooLarge;
  try {
    return await link.call(name, args);
  } catch (error) {
    return bridgeFailure(error, link.file());
  }
};

export { callTool };
