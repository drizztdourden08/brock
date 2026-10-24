/* @layer renderer-shell @kind logic */
import type { SettingsPatch, SettingsValueSource } from '../../settings.type';

const sourcePatch = <S extends object>(source: SettingsValueSource, refresh: () => void): SettingsPatch<S> =>
  (patch) => {
    const writes = Object.entries(patch).map(async ([key, value]) => source.set(key, value));
    void Promise.all(writes).then(refresh);
  };

export { sourcePatch };
