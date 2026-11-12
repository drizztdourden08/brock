/* @layer renderer-components @kind component */
import { useCallback, useEffect, useState } from 'react';
import type { MouseEvent } from 'react';
import { Box, Portal } from '@drizztdourden08/tessera/primitives';
import { CANCEL_ARM_DELAY_MS } from '../ControlsSettings.constants';
import { useBindingCapture } from '../behavior/useBindingCapture';
import type { BindingListenerProps } from './BindingListener.type';
import './BindingListener.css';

const stopPropagation = (e: MouseEvent) => e.stopPropagation();

const BindingListener = (props: BindingListenerProps) => {
  const { actionLabel, prompt, hint, extra, onCapture, onCancel } = props;
  const [canCancel, setCanCancel] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setCanCancel(true), CANCEL_ARM_DELAY_MS);
    return () => clearTimeout(timeout);
  }, []);

  useBindingCapture({ onCapture, onCancel });

  const handleBackdropClick = useCallback(() => { if (canCancel) onCancel(); }, [canCancel, onCancel]);

  return (
    <Portal layer="modal">
      <Box className="binding-listener-backdrop" onClick={handleBackdropClick}>
        <Box className="binding-listener" onClick={stopPropagation}>
          <Box className="binding-listener__prompt">{prompt}</Box>
          <Box className="binding-listener__label">{actionLabel}</Box>
          <Box className="binding-listener__hint">{hint}</Box>
          {extra && <Box className="binding-listener__extra">{extra}</Box>}
        </Box>
      </Box>
    </Portal>
  );
};

export { BindingListener };
