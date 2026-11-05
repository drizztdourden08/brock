/* @layer renderer-components @kind hook */
import { useCallback } from 'react';
import type { BindingSlot } from '../../../bindings';
import type { ActionScope, UseRebindTargetArgs } from '../ControlsBehavior.type';

const useRebindTarget = ({ setListeningFor }: UseRebindTargetArgs) => {
  const handleActionRebind = useCallback((scope: ActionScope, id: string) => {
    setListeningFor({ type: 'action', scope, id });
  }, [setListeningFor]);

  const handleVerbRebind = useCallback((id: string) => {
    setListeningFor({ type: 'verb', id });
  }, [setListeningFor]);

  const handleSlotRebind = useCallback((slot: BindingSlot) => {
    setListeningFor({ type: 'slot', slot });
  }, [setListeningFor]);

  return { handleActionRebind, handleVerbRebind, handleSlotRebind };
};

export { useRebindTarget };
