/* @layer renderer-shell @kind logic */
import { isRecord } from '../collections/is-record';
import { uiViewsFile } from '../stores/ui-views-file';
import { PROFILE_VIEWS_PREFIX } from './widget.constants';
import type { ProfileViews, ProfileViewsTake } from './widget.type';

const keyOf = (profileId: string): string => `${PROFILE_VIEWS_PREFIX}${profileId}`;

const read = async (profileId: string): Promise<ProfileViews> => {
  const stored = (await uiViewsFile.load())[keyOf(profileId)];
  return isRecord(stored) ? stored : {};
};

const merge = (all: Record<string, unknown>, profileId: string, next: ProfileViews): Promise<void> => {
  const current = all[keyOf(profileId)];
  return uiViewsFile.set(keyOf(profileId), { ...(isRecord(current) ? current : {}), ...next });
};

const patch = (profileId: string, next: ProfileViews): Promise<void> => {
  const all = uiViewsFile.cached();
  return all ? merge(all, profileId, next) : uiViewsFile.load().then((loaded) => merge(loaded, profileId, next));
};

const takeField = (all: Record<string, unknown>, field: string): unknown[] => {
  const taken: unknown[] = [];
  for (const [key, entry] of Object.entries(all)) {
    if (!key.startsWith(PROFILE_VIEWS_PREFIX) || !isRecord(entry) || !(field in entry)) continue;
    const { [field]: value, ...rest } = entry;
    taken.push(value);
    all[key] = rest;
    uiViewsFile.touch(key);
  }
  return taken;
};

const take = async (field: string): Promise<ProfileViewsTake> => {
  const all = await uiViewsFile.load();
  const found = Object.keys(all).length > 0;
  return { found, taken: takeField(all, field) };
};

const profileViews = { read, patch, take, flush: uiViewsFile.flush };

export { profileViews };
