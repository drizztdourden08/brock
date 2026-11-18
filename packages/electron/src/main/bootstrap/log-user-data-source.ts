/* @layer electron-main @kind logic */
import type { MainContext } from '../types/main-context.type';

const logUserDataSource = (ctx: MainContext, portableData: string | null, userDataOverride: string | null): void => {
  if (portableData) ctx.log(`user data lives beside the app: ${portableData}`);
  if (userDataOverride) ctx.log(`user data redirected by flag: ${userDataOverride}`);
};

export { logUserDataSource };
