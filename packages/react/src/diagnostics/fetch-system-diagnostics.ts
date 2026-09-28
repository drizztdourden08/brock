/* @layer renderer-shell @kind logic */
import type { SystemDiagnostics } from '@drizztdourden08/brock-core';
import { hostApi } from '../host/host-api';

const fetchSystemDiagnostics = async (): Promise<SystemDiagnostics | null> => {
  const api = hostApi();
  if (!api) return null;
  try {
    return await api.getSystemDiagnostics();
  } catch {
    return null;
  }
};

export { fetchSystemDiagnostics };
