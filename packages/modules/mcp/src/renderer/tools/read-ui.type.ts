/* @layer renderer-shell @kind types */
import type { McpData } from '../../mcp.type';

interface UiNodes {
  nodes: McpData[];
  truncated: boolean;
}

export type { UiNodes };
