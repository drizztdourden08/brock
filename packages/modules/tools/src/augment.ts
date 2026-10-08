/* @layer core @kind types */
import type { Result } from '@drizztdourden08/brock-core/result';
import type { ToolState, ToolsApi } from './tools.type';

declare module '@drizztdourden08/brock-core/augment' {
  interface InvokeContract {
    'tools:list': () => Promise<ToolState[]>;
    'tools:state': (id: string) => Promise<ToolState | null>;
    'tools:install': (id: string) => Promise<Result<ToolState>>;
  }

  interface IpcNamespaces {
    tools: ToolsApi;
  }
}
