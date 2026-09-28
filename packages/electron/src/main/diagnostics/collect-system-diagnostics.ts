/* @layer electron-main @kind logic */
import type { SystemDiagnostics } from '@drizztdourden08/brock-core/types';
import { collectCpu } from './collect-cpu';
import { collectMemory } from './collect-memory';
import { collectOs } from './collect-os';
import { collectVersions } from './collect-versions';
import { collectDisplays } from './collect-displays';
import { collectGpu } from './collect-gpu';

const collectSystemDiagnostics = async (): Promise<SystemDiagnostics> => ({
  os: collectOs(),
  cpu: collectCpu(),
  memory: collectMemory(),
  gpu: await collectGpu(),
  displays: collectDisplays(),
  versions: collectVersions(),
});

export { collectSystemDiagnostics };
