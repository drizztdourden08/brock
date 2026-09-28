/* @layer renderer-shell @kind hook */
import { useContext } from 'react';
import { BrockContext } from './brock-context';
import type { BrockContextValue } from './brock-context.type';

const useBrock = (): BrockContextValue => {
  const value = useContext(BrockContext);
  if (!value) throw new Error('useBrock must be used within <BrockApp>');
  return value;
};

export { useBrock };
