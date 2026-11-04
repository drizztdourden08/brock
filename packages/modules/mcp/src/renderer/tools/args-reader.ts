/* @layer renderer-shell @kind logic */
import type { McpArgs } from '../../mcp.type';

const argsReader = {
  text: (args: McpArgs, key: string): string | undefined => {
    const value = args[key];
    return typeof value === 'string' ? value : undefined;
  },
  count: (args: McpArgs, key: string): number | undefined => {
    const value = args[key];
    return typeof value === 'number' ? value : undefined;
  },
};

export { argsReader };
