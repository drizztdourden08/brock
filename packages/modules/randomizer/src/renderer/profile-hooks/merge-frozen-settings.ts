/* @layer renderer-shell @kind logic */
import { configFile, readJson, writeJson } from '@drizztdourden08/brock-core';
import type { FileStore } from '@drizztdourden08/brock-core';

const mergeFrozenSettings = async (files: FileStore, profileId: string, frozen: object | undefined): Promise<void> => {
  if (!frozen || Object.keys(frozen).length === 0) return;
  const current = await readJson<Record<string, unknown>>(files, configFile(profileId), {});
  await writeJson(files, configFile(profileId), { ...current, ...frozen });
};

export { mergeFrozenSettings };
