/* @layer core @kind types */
import type { McpStatus } from './mcp.type';

interface McpApi {
  status: () => Promise<McpStatus>;
  setEnabled: (on: boolean) => Promise<McpStatus>;
  toolsChanged: () => void;
}

export type { McpApi };
