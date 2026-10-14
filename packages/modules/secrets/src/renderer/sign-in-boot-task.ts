/* @layer renderer-shell @kind logic */
import type { RendererBootTask } from '@drizztdourden08/brock-react';
import { useSignInStore } from './useSignInStore';

const signInBootTask: RendererBootTask = {
  id: 'secrets-sign-in',
  label: 'Reading sign-in state',
  weight: 1,
  run: () => useSignInStore.getState().loadSignedIn(),
};

export { signInBootTask };
