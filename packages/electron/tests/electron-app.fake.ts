/* @layer electron-main @kind test */
const app = { once: (): void => undefined, isPackaged: false, getAppPath: (): string => '/app/dist/electron' };

export { app };
