/* @layer renderer-shell @kind hook */
import { useEffect } from 'react';
import type { PickScope } from '../../palette.type';
import { stepScope } from '../../step-scope';
import { scopeDirection } from './pick-scope-keys';

const useScopeKeys = (scopes: readonly PickScope[] | undefined, current: string | null, setPickScope: (id: string) => void): void => {
  useEffect(() => {
    if (scopes === undefined) return undefined;
    const onKeyDown = (event: KeyboardEvent): void => {
      const direction = scopeDirection(event);
      const next = direction === 0 ? undefined : stepScope(scopes, current, direction);
      if (next === undefined) return;
      event.preventDefault();
      event.stopPropagation();
      setPickScope(next.id);
    };
    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, [scopes, current, setPickScope]);
};

export { useScopeKeys };
