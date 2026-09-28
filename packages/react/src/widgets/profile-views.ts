/* @layer renderer-shell @kind logic */
import { hostApi } from '../host/host-api';
import { PROFILE_VIEWS_PREFIX, VIEWS_SAVE_DELAY_MS } from './widget.constants';
import type { ProfileViews } from './widget.type';

let cache: Record<string, unknown> | null = null;
let loading: Promise<Record<string, unknown>> | null = null;
let timer: ReturnType<typeof setTimeout> | null = null;
let dirty = false;

const keyOf = (profileId: string): string => `${PROFILE_VIEWS_PREFIX}${profileId}`;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

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

const patch = async (profileId: string, next: ProfileViews): Promise<void> => {
  const all = await loadAll();
  const current = all[keyOf(profileId)];
  all[keyOf(profileId)] = { ...(isRecord(current) ? current : {}), ...next };
  dirty = true;
  if (timer !== null) clearTimeout(timer);
  timer = setTimeout(writeNow, VIEWS_SAVE_DELAY_MS);
};

const profileViews = { read, patch, flush: writeNow };

export { profileViews };
