/* @layer renderer-shell @kind logic */
import type { I18n } from '@drizztdourden08/brock-core/i18n';
import type { BootFailure } from '@drizztdourden08/brock-core';

const failureTitle = (failure: BootFailure, t: I18n['t']): string =>
  t(failure.timedOut ? 'brock-app:boot.failure.timedOut' : 'brock-app:boot.failure.failed', { label: failure.label });

export { failureTitle };
