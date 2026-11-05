/* @layer renderer-shell @kind hook */
import { useCallback } from 'react';
import type { OpenRequest } from '@drizztdourden08/brock-core';
import { useAppOpen } from '@drizztdourden08/brock-react';
import { importMsulPack } from './import-msul-pack';
import type { MsulInstaller } from './msul-open.type';

const useMsulOpen = (store: MsulInstaller): void => {
  const handleOpen = useCallback((request: OpenRequest) => {
    if (request.kind === 'file' && request.ext === 'msul') void importMsulPack(store, request.path);
  }, [store]);
  useAppOpen(handleOpen);
};

export { useMsulOpen };
