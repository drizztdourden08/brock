/* @layer electron-main @kind logic */
import type { HandlerGroup } from '../types/main-context.type';
import { acceptAskReply } from './accept-ask-reply';

const askHandlers: HandlerGroup = {
  id: 'ask',
  register: ({ on }) => {
    on('ask:reply', (event, id, outcome) => acceptAskReply(event.sender.id, id, outcome));
  },
};

export { askHandlers };
