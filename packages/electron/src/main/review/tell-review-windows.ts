/* @layer electron-main @kind logic */
import { emit } from '../ipc/emit';
import { getMainWindow } from '../window/get-main-window';

const tellReviewWindows = (): void => {
  const main = getMainWindow();
  if (main) emit(main, 'review:windows');
};

export { tellReviewWindows };
