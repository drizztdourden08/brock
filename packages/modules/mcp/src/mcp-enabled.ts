/* @layer core @kind logic */
import type { McpEnabledInput } from './mcp.type';
import { MCP_ENV_OFF_VALUES, MCP_ENV_SWITCH, MCP_NO_FLAG } from './mcp.constants';

const isSwitchedOff = ({ argv, env }: Pick<McpEnabledInput, 'argv' | 'env'>): boolean => {
  if (argv.includes(MCP_NO_FLAG)) return true;
  const value = env[MCP_ENV_SWITCH];
  return value !== undefined && MCP_ENV_OFF_VALUES.includes(value.trim().toLowerCase());
};

const mcpEnabled = (input: McpEnabledInput): boolean => {
  if (isSwitchedOff(input)) return false;
  if (input.isPackaged) return input.options?.packaged === true;
  return input.options?.dev !== false;
};

export { mcpEnabled };
