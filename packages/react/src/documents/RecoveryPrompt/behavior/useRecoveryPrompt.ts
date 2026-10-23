/* @layer renderer-shell @kind hook */
import { useCallback, useState } from 'react';
import { getAppLog } from '../../../log/get-app-log';
import type { RecoveryPromptProps } from '../../documents.type';
import { useRecoverable } from '../../useRecoverable';
import type { RecoveryPromptState } from '../RecoveryPrompt.type';

const useRecoveryPrompt = ({ onRestore }: RecoveryPromptProps): RecoveryPromptState => {
  const { snapshots, restore, discard } = useRecoverable();
  const [deferred, setDeferred] = useState<readonly string[]>([]);
  const pending = snapshots.filter((snapshot) => !deferred.includes(snapshot.key));
  const current = pending[0] ?? null;

  const later = useCallback((): void => {
    if (current) setDeferred((keys) => [...keys, current.key]);
  }, [current]);

  const doRestore = useCallback((): void => {
    if (!current) return;
    void restore(current.key)
      .then(async (recovered) => {
        if (recovered === null) return later();
        await onRestore(recovered);
        await discard(current.key);
      })
      .catch((error: unknown) => {
        getAppLog().log('app', `Recovery of "${current.key}" failed: ${error instanceof Error ? error.message : String(error)}`, 'error');
        later();
      });
  }, [current, restore, discard, onRestore, later]);

  const doDiscard = useCallback((): void => {
    if (current) void discard(current.key);
  }, [current, discard]);

  return { current, waiting: pending.length - 1, restore: doRestore, discard: doDiscard, later };
};

export { useRecoveryPrompt };
