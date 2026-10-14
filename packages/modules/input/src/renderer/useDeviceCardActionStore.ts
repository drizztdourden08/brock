/* @layer renderer-shell @kind hook */
import { create } from 'zustand';
import type { DeviceCardActionState } from './device-card-action.type';

const useDeviceCardActionStore = create<DeviceCardActionState>()((set) => ({
  groups: [],
  add: (actions) => {
    const group = [...actions];
    set(({ groups }) => ({ groups: [...groups, group] }));
    return () => set(({ groups }) => ({ groups: groups.filter((candidate) => candidate !== group) }));
  },
}));

export { useDeviceCardActionStore };
