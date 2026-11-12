/* @layer renderer-components @kind hook */
import { useEffect } from 'react';
import { RawInputDispatcher } from '../../../bindings';
import { controllerInputStore } from '../../../controller-input/controller-input-store';
import { LISTEN_ARM_DELAY_MS, MODIFIER_CODES } from '../ControlsSettings.constants';
import type { BindingCapture, BindingListenerProps } from '../sub-components/BindingListener.type';
import { keyboardBindingFromEvent } from './keyboard-binding-from-event';

const useBindingCapture = ({ onCapture, onCancel }: Pick<BindingListenerProps, 'onCapture' | 'onCancel'>): void => {
  useEffect(() => {
    let cancelled = false;
    let captured = false;
    let unsubscribeInput: (() => void) | null = null;
    const dispatcher = new RawInputDispatcher();

    const finish = (capture: BindingCapture) => {
      if (cancelled || captured) return;
      captured = true;
      onCapture(capture);
    };

    const handleKey = (e: KeyboardEvent) => {
      if (cancelled) return;
      e.preventDefault();
      e.stopPropagation();
      if (e.code === 'Escape' || e.key === 'Escape' || e.key === 'Esc') {
        onCancel();
        return;
      }
      const isClear = ['Delete', 'Backspace'].includes(e.code) || ['Delete', 'Backspace'].includes(e.key);
      if (!isClear && (e.code === '' || MODIFIER_CODES.has(e.code))) return;
      const binding = isClear ? { type: 'none' as const } : keyboardBindingFromEvent(e);
      finish({ binding, deviceKey: 'keyboard', vendorId: null, productId: null });
    };

    const unsubscribeDispatcher = dispatcher.subscribe((event) => finish({
      binding: event.binding,
      deviceKey: event.sourceDeviceKey,
      vendorId: event.vendorId,
      productId: event.productId,
    }));

    const timeout = setTimeout(() => {
      if (cancelled) return;
      window.addEventListener('keydown', handleKey, true);
      unsubscribeInput = controllerInputStore.onInput((state) => {
        dispatcher.emitStates(new Map([[state.deviceKey, state]]));
      });
    }, LISTEN_ARM_DELAY_MS);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
      window.removeEventListener('keydown', handleKey, true);
      unsubscribeInput?.();
      unsubscribeDispatcher();
    };
  }, [onCapture, onCancel]);
};

export { useBindingCapture };
