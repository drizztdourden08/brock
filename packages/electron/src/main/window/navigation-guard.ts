/* @layer electron-main @kind logic */
import type { NavigatingContents } from './navigation-guard.type';
import { navigationVerdict } from './navigation-verdict';
import { openExternal } from './open-external';

const guardNavigation = (contents: NavigatingContents): void => {
  contents.on('will-navigate', (event, url) => {
    const verdict = navigationVerdict(contents.getURL(), url);
    if (verdict === 'stay') return;
    event.preventDefault();
    if (verdict === 'external') void openExternal(url);
  });
};

export { guardNavigation };
