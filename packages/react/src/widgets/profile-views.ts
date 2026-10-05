/* @layer renderer-shell @kind logic */
import { isRecord } from '../collections/is-record';
import { hostApi } from '../host/host-api';
import { PROFILE_VIEWS_PREFIX, VIEWS_SAVE_DELAY_MS } from './widget.constants';
import type { ProfileViews, ProfileViewsTake } from './widget.type';

let cache: Record<string, unknown> | null = null;
let loading: Promise<Record<string, unknown>> | null = null;
let timer: ReturnType<typeof setTimeout> | null = null;
let dirty = false;

const keyOf = (profileId: string): string => `${PROFILE_VIEWS_PREFIX}${profileId}`;

const fetchAll = async (): Promise<Record<string, unknown>> => {
  const api = hostApi();
  try {
    const data = api ? await api.loadUiViews() : {};
    return isRecord(data) ? data : {};
  } catch {
    return {};
  }
};

const loadAll = (): Promise<Record<string, unknown>> => {
  if (cache) return Promise.resolve(cache);
  loading ??= fetchAll().then((data) => {
    cache = data;
    return data;
  });
  return loading;
};

const writeNow = (): void => {
  if (timer !== null) clearTimeout(timer);
  timer = null;
  if (!dirty || !cache) return;
  dirty = false;
  hostApi()?.saveUiViews(cache).catch(() => undefined);
};

const read = async (profileId: string): Promise<ProfileViews> => {
  const stored = (await loadAll())[keyOf(profileId)];
  return isRecord(stored) ? stored : {};
};

const applyPatch = (all: Record<string, unknown>, profileId: string, next: ProfileViews): void => {
  const current = all[keyOf(profileId)];
  all[keyOf(profileId)] = { ...(isRecord(current) ? current : {}), ...next };
  dirty = true;
  if (timer !== null) clearTimeout(timer);
  timer = setTimeout(writeNow, VIEWS_SAVE_DELAY_MS);
};

const patch = (profileId: string, next: ProfileViews): Promise<void> => {
  if (cache) {
    applyPatch(cache, profileId, next);
    return Promise.resolve();
  }
  return loadAll().then((all) => applyPatch(all, profileId, next));
};

const takeField = (all: Record<string, unknown>, field: string): unknown[] => {
  const taken: unknown[] = [];
  for (const [key, entry] of Object.entries(all)) {
    if (!key.startsWith(PROFILE_VIEWS_PREFIX) || !isRecord(entry) || !(field in entry)) continue;
    const { [field]: value, ...rest } = entry;
    taken.push(value);
    all[key] = rest;
    dirty = true;
  }
  return taken;
};

const take = async (field: string): Promise<ProfileViewsTake> => {
  const all = await loadAll();
  const found = Object.keys(all).length > 0;
  return { found, taken: takeField(all, field) };
};

const profileViews = { read, patch, take, flush: writeNow };

export { profileViews };
