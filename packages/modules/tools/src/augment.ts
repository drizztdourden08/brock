/* @layer core @kind types */
import type { Result } from '@drizztdourden08/brock-core/result';
import type { RecordingFinalizeInput, RecordingOutcome } from './recording.type';
import type { ToolState, ToolsApi } from './tools.type';

declare module '@drizztdourden08/brock-core/augment' {
  interface InvokeContract {
    'tools:list': () => Promise<ToolState[]>;
    'tools:state': (id: string) => Promise<ToolState | null>;
    'tools:install': (id: string) => Promise<Result<ToolState>>;
    'tools:finalizeRecording': (input: RecordingFinalizeInput) => Promise<Result<RecordingOutcome>>;
  }

  interface EventContract {
    'tools:changed': (id: string) => void;
  }

  interface IpcNamespaces {
    tools: ToolsApi;
  }
}
