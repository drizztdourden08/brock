/* @layer electron-main @kind logic */
import { userDataRoot } from './user-data-root';

const initPaths = (dataPath: string): void => {
  userDataRoot.path = dataPath;
};

export { initPaths };
