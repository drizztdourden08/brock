/* @layer renderer-shell @kind hook */
import { useCallback, useEffect, useState } from 'react';
import { effectiveCustomRatio, validateCustomRatio } from '../../../aspect-ratio/index';
import type { RatioPairParams } from '../AspectRatioControl.type';

const useRatioPair = (params: RatioPairParams) => {
  const { customW, customH, limits, letterbox, onChange } = params;
  const eff = effectiveCustomRatio(customW, customH, limits, letterbox);
  const [w, setW] = useState(eff.w);
  const [h, setH] = useState(eff.h);
  useEffect(() => { setW(eff.w); setH(eff.h); }, [eff.w, eff.h]);

  const commit = useCallback((nw: number, nh: number) => {
    setW(nw); setH(nh);
    if (validateCustomRatio(nw, nh, limits).valid) onChange({ value: 'custom', customW: nw, customH: nh });
  }, [onChange, limits]);

  const handleWidth = useCallback((n: number) => commit(n, h), [commit, h]);
  const handleHeight = useCallback((n: number) => commit(w, n), [commit, w]);

  return { w, h, check: validateCustomRatio(w, h, limits), handleWidth, handleHeight };
};

export { useRatioPair };
