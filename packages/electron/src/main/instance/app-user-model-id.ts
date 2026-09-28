/* @layer electron-main @kind logic */
const appUserModelId = (appId: string, instanceName: string | null): string =>
  instanceName ? `${appId}.instance.${instanceName}` : appId;

export { appUserModelId };
