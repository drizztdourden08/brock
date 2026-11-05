/* @layer renderer-components @kind hook */
import { useCallback, useMemo } from 'react';
import { allowedDevices } from '../../../bindings';
import type { UseProfileRowsArgs } from '../ControlsBehavior.type';
import type { ActionDef } from '../ControlsSettings.type';
import { buildActionRows } from './build-action-rows';
import { buildRequiredInputs } from './build-required-inputs';

const useProfileRows = ({ activeProfile, devices, labels }: UseProfileRowsArgs) => {
  const requiredInputs = useMemo(
    () => buildRequiredInputs({ profile: activeProfile, devices, labels }),
    [activeProfile, devices, labels],
  );
  const multiController = useMemo(() => allowedDevices(activeProfile).gamepadKeys.size > 1, [activeProfile]);
  const mappings = activeProfile?.mappings;

  const rowsFor = useCallback(
    (actions: readonly ActionDef[]) => buildActionRows({ actions, mappings: mappings ?? [], multiController, devices }),
    [mappings, multiController, devices],
  );

  return { requiredInputs, multiController, rowsFor };
};

export { useProfileRows };
