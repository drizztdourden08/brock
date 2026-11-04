/* @layer electron-main @kind logic */
import type { McpArgs } from '../../mcp.type';

const number = (args: McpArgs, name: string, fallback: number): number => {
  const value = args[name];
  return typeof value === 'number' ? value : fallback;
};

const string = (args: McpArgs, name: string, fallback: string): string => {
  const value = args[name];
  return typeof value === 'string' ? value : fallback;
};

const boolean = (args: McpArgs, name: string, fallback: boolean): boolean => {
  const value = args[name];
  return typeof value === 'boolean' ? value : fallback;
};

const readArg = { number, string, boolean };

export { readArg };
