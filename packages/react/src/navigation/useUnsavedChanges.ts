/* @layer renderer-shell @kind hook */
import { useCallback, useEffect, useRef } from 'react';
import { quitGuards } from '../quit/quit-guards';
import { leaveGuards } from './leave-guards';
import { UNSAVED_QUIT_MESSAGE } from './navigation.constants';

const useUnsavedChanges = (dirty: boolean, message: string = UNSAVED_QUIT_MESSAGE): (() => void) => {
  const released = useRef(false);
  useEffect(() => {
    if (!dirty) return undefined;
    released.current = false;
    const offLeave = leaveGuards.add(() => !released.current);
    const offQuit = quitGuards.add(() => (released.current ? undefined : message));
    return () => {
      offLeave();
      offQuit();
    };
  }, [dirty, message]);
  return useCallback(() => { released.current = true; }, []);
};

export { useUnsavedChanges };
