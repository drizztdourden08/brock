/* @layer renderer-shell @kind hook */
import { useEffect, useRef, useState } from 'react';
import { getPlatform, nav, useNavigationStore, useProduct } from '@drizztdourden08/brock-react';
import { backStepOf } from './back-step-of';

const useMobileBack = () => {
  const { homeScreen } = useProduct();
  const [open, setOpen] = useState(false);
  const openRef = useRef(open);
  openRef.current = open;

  useEffect(() => getPlatform().device.onBackButton((edge) => {
    const hasScreen = useNavigationStore.getState().active !== null;
    const step = backStepOf(openRef.current, edge, hasScreen);
    if (step === 'close') setOpen(false);
    else if (step === 'open') setOpen(true);
    else if (step === 'escape') nav.escape();
    else nav.home(homeScreen);
  }), [homeScreen]);

  return { open, close: () => setOpen(false) };
};

export { useMobileBack };
