/* @layer renderer-components @kind hook */
import { useCallback, useMemo, useState } from 'react';
import { bindGlobalAction, bindProfileAction, clearProfileAction, mergeGlobalDefaults, padHexOrNull, UNBOUND } from '../../../bindings';
import type { ActionCapture, ListeningTarget, UseBindingStateArgs } from './controls-behavior.type';
import type { BindingCapture } from '../sub-components/BindingListener.type';
import { useRebindTarget } from './useRebindTarget';

const useBindingState = (args: UseBindingStateArgs) => {
  const { globalBindings, activeProfile, updateActiveProfile, applyVerbBinding, applySlotBinding } = args;
  const [listeningFor, setListeningFor] = useState<ListeningTarget | null>(null);

  const globalMappings = useMemo(
    () => mergeGlobalDefaults(globalBindings?.mappings, globalBindings?.defaults ?? []),
    [globalBindings?.mappings, globalBindings?.defaults],
  );
  const rebindHandlers = useRebindTarget({ setListeningFor });

  const handleActionClear = useCallback((actionId: string, mappingIndex: number) => {
    if (!activeProfile) return;
    updateActiveProfile(clearProfileAction({ profile: activeProfile, action: actionId, mappingIndex }));
  }, [activeProfile, updateActiveProfile]);

  const handleGlobalClear = useCallback((actionId: string) => {
    globalBindings?.onChange(bindGlobalAction({
      mappings: globalMappings, action: actionId, binding: UNBOUND, vid: null, pid: null,
    }));
  }, [globalBindings, globalMappings]);

  const bindAction = useCallback(({ scope, id, binding, vid, pid }: ActionCapture) => {
    if (scope === 'global') {
      globalBindings?.onChange(bindGlobalAction({ mappings: globalMappings, action: id, binding, vid, pid }));
    } else if (activeProfile) {
      updateActiveProfile(bindProfileAction({ profile: activeProfile, action: id, binding, vid, pid }));
    }
  }, [globalBindings, globalMappings, activeProfile, updateActiveProfile]);

  const handleCapture = useCallback(({ binding, vendorId, productId }: BindingCapture) => {
    if (!listeningFor) return;
    setListeningFor(null);
    switch (listeningFor.type) {
      case 'verb':
        applyVerbBinding(listeningFor.id, binding);
        return;
      case 'slot':
        applySlotBinding(listeningFor.slot, binding);
        return;
      case 'action':
        bindAction({
          scope: listeningFor.scope, id: listeningFor.id, binding,
          vid: padHexOrNull(vendorId), pid: padHexOrNull(productId),
        });
    }
  }, [listeningFor, applyVerbBinding, applySlotBinding, bindAction]);

  const cancelListening = useCallback(() => setListeningFor(null), []);

  return {
    listeningFor,
    globalMappings,
    ...rebindHandlers,
    handleActionClear,
    handleGlobalClear,
    handleCapture,
    cancelListening,
  };
};

export { useBindingState };
