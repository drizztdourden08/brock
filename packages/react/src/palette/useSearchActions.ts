/* @layer renderer-shell @kind hook */
import { useEffect } from 'react';
import type { SearchAction } from './palette.type';
import { registerSearchActions } from './register-search-actions';

const useSearchActions = (actions: readonly SearchAction[]): void => {
  useEffect(() => registerSearchActions(actions), [actions]);
};

export { useSearchActions };
