/* @layer electron-main @kind logic */
import { app } from 'electron';

const isPackagedApp = (): boolean => app.isPackaged !== false;

export { isPackagedApp };
