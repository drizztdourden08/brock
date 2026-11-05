/* @layer renderer-shell @kind hook */
import { useContext } from 'react';
import { MsuStudioContext } from './msu-studio-context';
import type { MsuStudioValue } from './msu-studio-value.type';

const useMsuStudio = <Ctx = unknown, Target = unknown>(): MsuStudioValue<Ctx, Target> => {
  const value = useContext(MsuStudioContext);
  if (value === null || value.store === null) throw new Error('useMsuStudio needs a MsuStudioProvider with a store above it');
  return value as MsuStudioValue<Ctx, Target>;
};

export { useMsuStudio };
