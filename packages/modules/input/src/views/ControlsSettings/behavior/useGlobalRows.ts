/* @layer renderer-components @kind hook */
import { useCallback } from 'react';
import type { UseGlobalRowsArgs } from './controls-behavior.type';
import type { ActionDef } from '../ControlsSettings.type';
import { buildActionRows } from './build-action-rows';

const useGlobalRows = ({ mappings, multiController, devices }: UseGlobalRowsArgs) =>
  useCallback(
    (actions: readonly ActionDef[]) => buildActionRows({ actions, mappings, multiController, devices }),
    [mappings, multiController, devices],
  );

export { useGlobalRows };
