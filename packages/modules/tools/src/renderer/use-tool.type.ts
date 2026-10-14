/* @layer renderer-shell @kind types */
import type { ToolState } from '../tools.type';

interface UseToolResult {
  state: ToolState | null;
  installing: boolean;
  error: string | null;
  install: () => Promise<boolean>;
  refresh: () => Promise<void>;
}

interface UseToolOptions {
  refreshOnFocus?: boolean;
}

export type { UseToolOptions, UseToolResult };
