/* @layer electron-main @kind logic */
import type { WebContents } from 'electron';
import { PREPARE_CEILING_MS } from './review-baselines.constants';
import { QUIET_SCRIPT } from './window-quiet.constants';

const loaded = (contents: WebContents): Promise<void> => new Promise((resolve) => {
  if (!contents.isLoading()) {
    resolve();
    return;
  }
  const done = (): void => {
    clearTimeout(ceiling);
    contents.removeListener('did-finish-load', done);
    contents.removeListener('did-fail-load', done);
    resolve();
  };
  const ceiling = setTimeout(done, PREPARE_CEILING_MS);
  ceiling.unref();
  contents.once('did-finish-load', done);
  contents.once('did-fail-load', done);
});

const windowQuiet = async (contents: WebContents): Promise<void> => {
  if (contents.isDestroyed()) return;
  await loaded(contents);
  if (contents.isDestroyed()) return;
  const ceiling = new Promise<void>((resolve) => { setTimeout(resolve, PREPARE_CEILING_MS).unref(); });
  await Promise.race([contents.executeJavaScript(QUIET_SCRIPT, true).then(() => undefined, () => undefined), ceiling]);
};

export { windowQuiet };
