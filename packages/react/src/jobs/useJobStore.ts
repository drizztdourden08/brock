/* @layer renderer-shell @kind hook */
import { create } from 'zustand';
import type { JobStoreState } from './jobs.type';

const useJobStore = create<JobStoreState>()((set) => ({
  jobs: {},
  shown: null,
  upsert: (job) => set((state) => ({ jobs: { ...state.jobs, [job.id]: job } })),
  remove: (id) => set((state) => {
    const { [id]: _gone, ...rest } = state.jobs;
    return { jobs: rest, shown: state.shown === id ? null : state.shown };
  }),
  show: (id) => set({ shown: id }),
}));

export { useJobStore };
