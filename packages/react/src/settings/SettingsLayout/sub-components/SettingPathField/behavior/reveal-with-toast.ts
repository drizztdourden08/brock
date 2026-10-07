/* @layer renderer-shell @kind logic */
import type { Result } from '@drizztdourden08/brock-core';
import { toast } from '../../../../../toast/toast';

const revealWithToast = (reveal: ((path: string) => Promise<Result>) | undefined) => (reveal
  ? (path: string): void => {
    void reveal(path).then((result) => {
      if (!result.success) toast(`Could not show ${path}: ${result.error}`, { variant: 'danger' });
    });
  }
  : undefined);

export { revealWithToast };
