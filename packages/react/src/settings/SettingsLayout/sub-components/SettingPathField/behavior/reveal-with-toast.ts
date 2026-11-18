/* @layer renderer-shell @kind logic */
import type { Result } from '@drizztdourden08/brock-core';
import { msg } from '@drizztdourden08/brock-core/i18n';
import { controlSources } from '../../../../../app/control-sources';
import { toast } from '../../../../../toast/toast';

const revealWithToast = (reveal: ((path: string) => Promise<Result>) | undefined) => (reveal
  ? (path: string): void => {
    void reveal(path).then((result) => {
      if (!result.success) toast(controlSources.get().text(msg('brock-settings:path.revealFailed', { path, error: result.error })), { variant: 'danger' });
    });
  }
  : undefined);

export { revealWithToast };
