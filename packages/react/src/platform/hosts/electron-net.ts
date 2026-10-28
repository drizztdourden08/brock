/* @layer renderer-shell @kind logic */
import type { NetPort } from '@drizztdourden08/brock-core';
import { requireHostApi } from '../../host/require-host-api';

const createElectronNet = (): NetPort => {
  const api = requireHostApi();
  return {
    read: async (url, options) => {
      const answer = await api.netRead(url, options);
      return { bytes: new Uint8Array(answer.bytes), contentType: answer.contentType, url: answer.url };
    },
  };
};

export { createElectronNet };
