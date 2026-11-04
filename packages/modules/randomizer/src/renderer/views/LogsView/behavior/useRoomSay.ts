/* @layer renderer-shell @kind hook */
import { useCallback } from 'react';
import { useSessionStore } from '../../../../session';
import { canSay } from './can-say';

const useRoomSay = (): ((text: string) => boolean) | null => {
  const session = useSessionStore((state) => state.session);
  const say = useCallback((text: string): boolean => {
    const trimmed = text.trim();
    if (trimmed === '' || !canSay(session)) return false;
    session.say(trimmed);
    return true;
  }, [session]);
  return canSay(session) ? say : null;
};

export { useRoomSay };
