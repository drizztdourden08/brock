/* @layer core @kind types */
import type { McpModuleOptions } from './mcp.type';

declare module '@drizztdourden08/brock-core/augment' {
  interface ModuleOptions {
    mcp: McpModuleOptions;
  }
}
