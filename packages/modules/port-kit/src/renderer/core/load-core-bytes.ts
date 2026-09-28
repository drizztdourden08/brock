/* @layer renderer-shell @kind logic */
import { portKitApi } from '../port-kit-api';

const isHttpPage = (): boolean => location.protocol === 'http:' || location.protocol === 'https:';

const loadCoreBytes = async (wasm: string): Promise<ArrayBuffer> => {
  if (isHttpPage()) {
    const response = await fetch(new URL(wasm, location.href).href);
    if (!response.ok) throw new Error(`The core ${wasm} answered ${response.status}.`);
    return response.arrayBuffer();
  }
  const api = portKitApi();
  const bytes = api ? await api.readCore(wasm) : null;
  if (!bytes) throw new Error(`The core ${wasm} is not in the app bundle.`);
  return bytes;
};

export { loadCoreBytes };
