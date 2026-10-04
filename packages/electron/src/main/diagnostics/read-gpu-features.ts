/* @layer electron-main @kind logic */
import { app } from 'electron';

const stringEntries = (source: object): Record<string, string> => {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(source)) if (typeof value === 'string') out[key] = value;
  return out;
};

const readGpuFeatures = (): Record<string, string> => {
  try {
    return stringEntries(app.getGPUFeatureStatus());
  } catch {
    return {};
  }
};

export { readGpuFeatures };
