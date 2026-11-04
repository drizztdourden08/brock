/* @layer core @kind types */
import type { AskContractOf, InvokeContractOf, SendContractOf } from '@drizztdourden08/brock-core/ipc';
import type { MCP_CHANNELS } from './mcp-channels.constants';
import type { McpApi, McpModuleOptions } from './mcp.type';

declare module '@drizztdourden08/brock-core/augment' {
  interface ModuleOptions {
    mcp: McpModuleOptions;
  }

  interface InvokeContract extends InvokeContractOf<typeof MCP_CHANNELS> {}

  interface SendContract extends SendContractOf<typeof MCP_CHANNELS> {}

  interface AskContract extends AskContractOf<typeof MCP_CHANNELS> {}

  interface IpcNamespaces {
    mcp: McpApi;
  }
}
