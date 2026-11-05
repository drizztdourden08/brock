/* @layer renderer-shell @kind component */
import { useMemo } from 'react';
import { MsuStudioContext } from '../msu-studio-context';
import type { MsuStudioProviderProps } from './MsuStudioProvider.type';

const MsuStudioProvider = <Ctx = unknown, Target = unknown>({ game, store = null, children }: MsuStudioProviderProps<Ctx, Target>) => {
  const value = useMemo(() => ({ game: game as never, store }), [game, store]);
  return <MsuStudioContext.Provider value={value}>{children}</MsuStudioContext.Provider>;
};

export { MsuStudioProvider };
