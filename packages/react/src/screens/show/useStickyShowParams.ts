/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import { NO_PARAMS } from '../../navigation/navigation.constants';
import type { ScreenParams } from '../../navigation/navigation.type';
import { stickyParams } from '../../navigation/sticky-params';
import { useNavigationStore } from '../../navigation/useNavigationStore';

const useStickyShowParams = (): ScreenParams => {
  const key = useNavigationStore((s) => JSON.stringify(stickyParams.pick(s.active, s.params)));
  return useMemo(() => (key === '{}' ? NO_PARAMS : (JSON.parse(key) as ScreenParams)), [key]);
};

export { useStickyShowParams };
