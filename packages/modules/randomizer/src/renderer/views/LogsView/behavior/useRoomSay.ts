/* @layer renderer-shell @kind hook */
import { useCallback } from 'react';
import { useOnlineClient } from '../../../online/hooks/behavior/useOnlineClient';

const useRoomSay = (): ((text: string) => boolean) | null => {
  const client = useOnlineClient();
  const say = useCallback((text: string): boolean => {
    const trimmed = text.trim();
    if (trimmed === '' || client === null) return false;
    client.say(trimmed);
    return true;
  }, [client]);
  return client === null ? null : say;
};

export { useRoomSay };
