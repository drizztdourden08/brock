/* @layer renderer-shell @kind hook */
import { useEffect, useState } from 'react';
import { inputApi } from './input-api';
import { isInputAvailable } from './is-input-available';

const useHoldReleased = (): boolean => {
  const [released, setReleased] = useState(false);

  useEffect(() => {
    if (!isInputAvailable()) return undefined;
    return inputApi().capture.onHoldChanged((held) => setReleased(!held));
  }, []);

  return released;
};

export { useHoldReleased };
