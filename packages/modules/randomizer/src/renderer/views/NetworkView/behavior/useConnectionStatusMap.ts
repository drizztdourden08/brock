/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import { useText } from '@drizztdourden08/brock-react';
import type { StatusMap } from '@drizztdourden08/tessera/primitives';
import type { ConnectionState } from '../../../../archipelago';
import { CONNECTION_STATUS } from '../sub-components/ConnectionSection/ConnectionSection.constants';

const useConnectionStatusMap = (): StatusMap<ConnectionState> => {
  const text = useText();
  return useMemo(
    () => Object.fromEntries(
      Object.entries(CONNECTION_STATUS).map(([state, def]) => [state, { ...def, label: text(def.label) }]),
    ) as StatusMap<ConnectionState>,
    [text],
  );
};

export { useConnectionStatusMap };
