/* @layer renderer-shell @kind hook */
import { useEffect, useState } from 'react';
import type { WindowGuideState } from '@drizztdourden08/brock-core';
import { hostApi } from '../host/host-api';
import { CLOSED_GUIDE } from './WindowGuide/WindowGuide.constants';

const useWindowGuide = (): WindowGuideState => {
  const [guide, setGuide] = useState<WindowGuideState>(CLOSED_GUIDE);
  useEffect(() => hostApi()?.onWindowGuide(setGuide), []);
  return guide;
};

export { useWindowGuide };
