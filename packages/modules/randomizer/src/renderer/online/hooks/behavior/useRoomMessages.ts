/* @layer renderer-shell @kind hook */
import { useEffect, useState } from 'react';
import type { RoomMessage } from '../../../../archipelago';
import { NO_MESSAGES } from '../hooks.constants';
import { useOnlineClient } from './useOnlineClient';

const useRoomMessages = (): readonly RoomMessage[] => {
  const client = useOnlineClient();
  const [messages, setMessages] = useState<readonly RoomMessage[]>(NO_MESSAGES);
  useEffect(() => {
    if (client === null) {
      setMessages(NO_MESSAGES);
      return undefined;
    }
    const read = (): void => setMessages(client.messages());
    read();
    return client.subscribe(read);
  }, [client]);
  return messages;
};

export { useRoomMessages };
