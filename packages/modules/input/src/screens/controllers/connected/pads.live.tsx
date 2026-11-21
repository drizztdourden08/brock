/* @layer renderer-app @kind component */
import { useMemo } from 'react';
import { useText } from '@drizztdourden08/brock-react';
import type { LiveMeta, LivePage } from '@drizztdourden08/brock-react';
import { useControllerDevices } from '../../../renderer/useControllerDevices';
import { useHoldAwareGroups } from '../../../renderer/useHoldAwareGroups';
import { padLivePages } from '../../../views/ControllerPage';

const meta: LiveMeta = {
  icon: 'gamepad-2',
  empty: 'No controllers',
  order: 0,
  keywords: ['controller', 'gamepad', 'hid', 'rumble', 'raw bytes', 'stick', 'trigger', 'calibrate', 'report'],
};

const usePads = (): readonly LivePage[] => {
  const text = useText();
  const { groups: live } = useControllerDevices();
  const { groups, released } = useHoldAwareGroups(live);
  return useMemo(() => padLivePages(groups, released, text), [groups, released, text]);
};

export default usePads;
export { meta };
