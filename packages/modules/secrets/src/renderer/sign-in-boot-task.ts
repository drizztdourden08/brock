/* @layer renderer-shell @kind logic */
import { msg } from '@drizztdourden08/brock-core/i18n';
import type { RendererBootTask } from '@drizztdourden08/brock-react';
import { useSignInStore } from './useSignInStore';

const signInBootTask: RendererBootTask = {
  id: 'secrets-sign-in',
  label: msg('secrets:boot.signIn'),
  weight: 1,
  run: () => useSignInStore.getState().loadSignedIn(),
};

export { signInBootTask };
