/* @layer electron-main @kind logic */
import type { WebContents } from 'electron';

const dropWhenGone = (sender: WebContents, drop: () => void): void => {
  sender.on('did-start-navigation', (details) => {
    if (details.isMainFrame && !details.isSameDocument) drop();
  });
  sender.on('render-process-gone', drop);
  sender.on('destroyed', drop);
};

export { dropWhenGone };
