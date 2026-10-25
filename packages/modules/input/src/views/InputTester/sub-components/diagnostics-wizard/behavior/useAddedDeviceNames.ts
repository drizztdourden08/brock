/* @layer renderer-shell @kind hook */
import { useCallback } from 'react';
import { recallControllerName } from '../../../../../runtime/controller-name-cache/recall-controller-name';
import type { NameLookupParams } from '../diagnostics-wizard.type';

const useAddedDeviceNames = (): ((params: NameLookupParams) => string | null) => {
  return useCallback((params: NameLookupParams) => recallControllerName(params), []);
};

export { useAddedDeviceNames };
