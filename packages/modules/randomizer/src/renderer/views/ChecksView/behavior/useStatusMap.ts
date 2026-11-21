/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import { useText } from '@drizztdourden08/brock-react';
import type { StatusMap } from '@drizztdourden08/tessera/primitives';
import type { LocationStatus } from '../../../../tracker';
import { STATUS_DEFS, STATUS_ORDER } from '../ChecksView.constants';

const useStatusMap = (): StatusMap<LocationStatus> => {
  const text = useText();
  return useMemo(
    () => Object.fromEntries(STATUS_ORDER.map((status) => [status, { ...STATUS_DEFS[status], label: text(STATUS_DEFS[status].label) }])) as StatusMap<LocationStatus>,
    [text],
  );
};

export { useStatusMap };
