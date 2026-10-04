/* @layer electron-main @kind logic */
import { relink } from './relink';
import { releaseLinks } from './release-links';
import { widgetWindowControl } from './widget-window-control';

const detachWindow = (id: string): void => {
  const entry = widgetWindowControl.entryOf(id);
  if (entry) relink(id, entry, null);
  releaseLinks(id);
};

export { detachWindow };
