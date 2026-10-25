/* @layer renderer-components @kind hook */
import { useMemo } from 'react';
import type { RumbleTest } from '../../../renderer/rumble-test.type';
import { useRumbleTestStore } from '../../../renderer/useRumbleTestStore';
import { RUMBLE_TESTS } from '../ControllerPage.constants';

const useRumbleTests = (): readonly RumbleTest[] => {
  const groups = useRumbleTestStore((state) => state.groups);
  return useMemo(() => [...RUMBLE_TESTS, ...groups.flat()], [groups]);
};

export { useRumbleTests };
