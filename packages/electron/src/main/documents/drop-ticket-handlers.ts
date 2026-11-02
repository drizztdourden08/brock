/* @layer electron-main @kind logic */
import { ipcMain } from 'electron';
import type { HandlerGroup } from '../types/main-context.type';
import { fromAppFrame } from '../ipc/from-app-frame';
import { DROP_TICKET_CHANNEL } from '../../preload/drop-ticket.constants';
import { dropTickets } from './shared-drop-tickets';

const dropTicketHandlers: HandlerGroup = {
  id: 'dropTickets',
  register: () => {
    ipcMain.on(DROP_TICKET_CHANNEL, (event, paths: unknown) => {
      if (!fromAppFrame(event, { anyWindow: true }) || !Array.isArray(paths)) return;
      const { sender } = event;
      if (!dropTickets.has(sender.id)) sender.once('destroyed', () => dropTickets.forget(sender.id));
      dropTickets.issue(
        sender.id,
        paths.filter((path): path is string => typeof path === 'string'),
      );
    });
  },
};

export { dropTicketHandlers };
