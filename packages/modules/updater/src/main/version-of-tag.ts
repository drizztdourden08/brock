/* @layer electron-main @kind logic */
import { RELEASE_TAG_PREFIX } from './updater-main.constants';

const versionOfTag = (tag: string): string =>
  (tag.startsWith(RELEASE_TAG_PREFIX) ? tag.slice(RELEASE_TAG_PREFIX.length) : tag);

export { versionOfTag };
