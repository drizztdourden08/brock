/* @layer renderer-shell @kind hook */
import { useEffect, useRef } from 'react';
import type { AppOpenHandler } from './app-open.type';
import { appOpen } from './app-open';

const useAppOpen = (handler: AppOpenHandler): void => {
  const latest = useRef(handler);
  latest.current = handler;
  useEffect(() => appOpen.on((request) => latest.current(request)), []);
};

export { useAppOpen };
