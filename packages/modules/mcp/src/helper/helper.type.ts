/* @layer mcp-helper @kind types */
import type { JsonValue } from '@drizztdourden08/brock-core/ipc';
import type { BridgeClient } from '@drizztdourden08/brock-electron/bridge';
import type { McpToolInfo, McpToolResult } from '../mcp.type';

interface HelperArgs {
  userData: string | null;
  instance: string | null;
  file: string | null;
}

interface TargetOptions {
  app: string | null;
  appDir: string;
}

type McpJsonArgs = Record<string, JsonValue>;

interface McpHello {
  version: number;
  app: string;
  enabled: boolean;
}

interface AppLink {
  file: () => string;
  retarget: (file: string) => void;
  tools: () => Promise<McpToolInfo[]>;
  call: (name: string, args: McpJsonArgs) => Promise<McpToolResult>;
  onToolsChanged: (listener: () => void) => void;
  warm: () => void;
  close: () => void;
}

interface LinkState {
  file: string;
  client: BridgeClient | null;
  hello: Promise<void> | null;
  down: boolean;
}

export type { HelperArgs, TargetOptions, McpJsonArgs, McpHello, AppLink, LinkState };
