/* @layer renderer-shell @kind logic */
import { requireHostApi } from '../host/require-host-api';
import type { DataDomainClient } from './storage.type';

const copyOf = (data: Uint8Array): ArrayBuffer => new Uint8Array(data).buffer;

const dataDomain = (domain: string): DataDomainClient => {
  const api = requireHostApi();
  return {
    domain,
    readJson: async <T>(path: string) => (await api.domainReadJson(domain, path)) as T | null,
    writeJson: (path, value) => api.domainWriteJson(domain, path, value),
    readBytes: async (path) => {
      const data = await api.domainReadBytes(domain, path);
      return data ? new Uint8Array(data) : null;
    },
    writeBytes: (path, data) => api.domainWriteBytes(domain, path, copyOf(data)),
    list: (dir = '') => api.domainList(domain, dir),
    remove: (path) => api.domainRemove(domain, path),
    size: (path = '') => api.domainSize(domain, path),
  };
};

export { dataDomain };
