/* @layer core @kind logic */
import type { McpEnabledInput } from './mcp.type';

const mcpEnabled = ({ isPackaged, options }: McpEnabledInput): boolean => {
  if (isPackaged) return options?.packaged === true;
  return options?.dev !== false;
};

export { mcpEnabled };
