/* @layer electron-main @kind logic */
import type { HandlerGroup } from '../types/main-context.type';
import { fromAppFrame } from '../ipc/from-app-frame';
import { dragOut } from './drag-out';
import { fileDragIcon } from './file-drag-icon';

const dndHandlers: HandlerGroup = {
  id: 'dnd',
  register: ({ handle, documents }) => {
    handle('dnd:dragOut', (event, paths) =>
      dragOut(
        {
          resolve: (path) => documents.resolve(path),
          fromApp: () => fromAppFrame(event, { anyWindow: true }),
          icon: fileDragIcon,
          start: (files, icon) => event.sender.startDrag({ file: files[0] as string, files, icon }),
        },
        paths,
      ),
    );
  },
};

export { dndHandlers };
