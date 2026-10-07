/* @layer electron-main @kind logic */
import type { HandlerGroup } from '../types/main-context.type';
import { openFolder } from '../files/open-folder';
import { revealPath } from '../files/reveal-path';

const shellHandlers: HandlerGroup = {
  id: 'shell',
  register: ({ handle }) => {
    handle('shell:openFolder', (_event, path) => openFolder(path));
    handle('shell:revealPath', (_event, path) => revealPath(path));
  },
};

export { shellHandlers };
