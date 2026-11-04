/* @layer core @kind logic */
import type { ProfileStoreHooks } from './profile-store.type';

const composeProfileHooks = (list: readonly (ProfileStoreHooks | undefined)[]): ProfileStoreHooks => {
  const hooks = list.filter((h): h is ProfileStoreHooks => h !== undefined);
  const builders = hooks.flatMap((h) => (h.build ? [h.build] : []));
  const creators = hooks.flatMap((h) => (h.onCreate ? [h.onCreate] : []));
  const patchable = hooks.flatMap((h) => h.patchable ?? []);
  const composed: ProfileStoreHooks = {};
  if (builders.length > 0) {
    composed.build = (opts) => builders.map((build) => build(opts)).reduce((acc, ext) => ({ ...acc, ...ext }));
  }
  if (hooks.some((h) => h.patchable)) composed.patchable = [...new Set(patchable)];
  if (creators.length > 0) {
    composed.onCreate = async (profile, files) => {
      for (const create of creators) await create(profile, files);
    };
  }
  return composed;
};

export { composeProfileHooks };
