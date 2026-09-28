/* @layer renderer-shell @kind hook */
import { create } from 'zustand';
import type { RefreshRateInfo } from '../display.type';
import { displayApi } from './display-api';
import { measureRefreshRate } from './measure-refresh-rate';
import { EMPTY_REFRESH_RATE } from './refresh-rate.constants';
import type { RefreshRateState } from './refresh-rate-store.type';

const readHost = async (): Promise<RefreshRateInfo> => {
  const api = displayApi();
  if (!api) return EMPTY_REFRESH_RATE;
  try {
    return await api.getRefreshRate();
  } catch {
    return EMPTY_REFRESH_RATE;
  }
};

const useRefreshRateStore = create<RefreshRateState>()((set, get) => ({
  info: EMPTY_REFRESH_RATE,
  reading: false,

  refresh: async () => {
    if (get().reading) return;
    set({ reading: true });
    try {
      const hostInfo = await readHost();
      set({ info: { ...hostInfo, measuredHz: get().info.measuredHz } });
      const measuredHz = await measureRefreshRate();
      set((state) => ({ info: { ...state.info, measuredHz } }));
    } finally {
      set({ reading: false });
    }
  },
}));

export { useRefreshRateStore };
