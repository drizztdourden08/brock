/* @layer core @kind types */
import type { AudioProbe } from './audio-probe';
import type { MsuHostApi } from './ipc/msu-host-api.type';
import type { OptimizeAnalysis, OptimizeProgress, OptimizeRunResult } from './optimize';

declare module '@drizztdourden08/brock-core/augment' {
  interface InvokeContract {
    'msu:msul:read': (filePath: string) => Promise<ArrayBuffer>;
    'msu:optimize:measure': (packName: string) => Promise<OptimizeAnalysis>;
    'msu:optimize:convert': (packName: string, fileNames: string[]) => Promise<OptimizeRunResult>;
    'msu:audio:probe': (dataPath: string) => ReturnType<AudioProbe>;
  }
  interface EventContract {
    'msu:optimize:step': (progress: OptimizeProgress) => void;
  }
  interface IpcNamespaces {
    msu: MsuHostApi;
  }
}
