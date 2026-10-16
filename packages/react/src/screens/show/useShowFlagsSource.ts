/* @layer renderer-shell @kind hook */
import { useLayoutEffect } from 'react';
import type { ShowFlagValues } from './show.type';
import { useShowFlagsStore } from './useShowFlagsStore';

const useShowFlagsSource = (source: string, values: ShowFlagValues | undefined): void => {
  useLayoutEffect(() => {
    if (values === undefined) useShowFlagsStore.getState().drop(source);
    else useShowFlagsStore.getState().put(source, values);
  });
  useLayoutEffect(() => () => useShowFlagsStore.getState().drop(source), [source]);
};

export { useShowFlagsSource };
