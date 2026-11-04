/* @layer electron-main @kind types */
import type { BrowserWindow } from 'electron';
import type { MainContext } from '@drizztdourden08/brock-electron/main';
import type {
  McpArgs, McpReply, McpSerialQueue, McpToolInfo, McpToolRegistry, McpToolResult,
} from '../mcp.type';

interface McpHello {
  version: number;
  app: string;
  name: string;
  appVersion: string;
}

interface McpMain {
  tools: McpToolRegistry;
}

interface RendererTools {
  list: () => Promise<McpToolInfo[]>;
  call: (name: string, args: McpArgs) => Promise<McpToolResult>;
}

interface McpRuntime {
  ctx: MainContext;
  available: boolean;
  registry: McpToolRegistry;
  queue: McpSerialQueue;
  renderer: RendererTools;
  mcp: McpMain;
  changed: () => void;
}

interface MainToolEnv {
  ctx: MainContext;
  queue: McpSerialQueue;
  win: BrowserWindow | null;
}

type MainTool = (args: McpArgs, env: MainToolEnv) => Promise<McpReply>;

export type { McpHello, McpMain, RendererTools, McpRuntime, MainToolEnv, MainTool };
