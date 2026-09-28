/* @layer electron-main @kind logic */
import { arch, cpus } from 'os';
import type { CpuInfo } from 'os';
import type { CpuDiagnostics } from '@drizztdourden08/brock-core/types';

const cpuModel = (cores: CpuInfo[]): string => {
  const model = cores[0]?.model.trim();
  if (!model) return 'unknown';
  return model;
};

const collectCpu = (): CpuDiagnostics => {
  const cores = cpus();
  return {
    model: cpuModel(cores),
    logicalCores: cores.length,
    speedMhz: cores[0]?.speed ?? 0,
    arch: arch(),
  };
};

export { collectCpu };
