/* @layer core @kind logic */
import type { JobHandle, JobRecord } from './job-handle.type';

const settled = async (handle: JobHandle): Promise<unknown> => {
  const state = await handle.ended;
  if (state !== 'done') throw new Error(`job "${handle.id}" ${state}`);
  return undefined;
};

const joinJobHandle = (handle: JobHandle, record: JobRecord): JobHandle => ({
  ...handle,
  run: <T>() => (record.outcome ?? settled(handle)) as Promise<T>,
});

export { joinJobHandle };
