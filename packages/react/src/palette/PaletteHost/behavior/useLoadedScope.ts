/* @layer renderer-shell @kind hook */
import { useEffect, useRef, useState } from 'react';
import type { PalettePick, PickOption, PickScope } from '../../palette.type';
import { EMPTY_LOADED, NO_PICK_OPTIONS } from '../PaletteHost.constants';
import type { LoadedScopes, StartedScopes } from '../PaletteHost.type';

const useLoadedScope = (picking: PalettePick | null, scope: PickScope | undefined): readonly PickOption[] | null => {
  const [loaded, setLoaded] = useState<LoadedScopes>(EMPTY_LOADED);
  const started = useRef<StartedScopes>({ owner: null, ids: new Set() });

  useEffect(() => {
    const source = scope?.options;
    if (picking === null || scope === undefined || typeof source !== 'function') return;
    if (started.current.owner !== picking) started.current = { owner: picking, ids: new Set() };
    if (started.current.ids.has(scope.id)) return;
    started.current.ids.add(scope.id);
    const store = (options: readonly PickOption[]): void => {
      setLoaded((previous) => ({ owner: picking, byScope: { ...(previous.owner === picking ? previous.byScope : {}), [scope.id]: options } }));
    };
    void source().then(store, () => store(NO_PICK_OPTIONS));
  }, [picking, scope]);

  if (scope === undefined) return NO_PICK_OPTIONS;
  if (typeof scope.options !== 'function') return scope.options;
  return loaded.owner === picking ? (loaded.byScope[scope.id] ?? null) : null;
};

export { useLoadedScope };
