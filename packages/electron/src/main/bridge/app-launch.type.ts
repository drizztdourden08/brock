/* @layer electron-main @kind types */
interface AppLaunch {
  command: string;
  args: string[];
  env: Record<string, string>;
}

interface AppLaunchOptions {
  background?: boolean;
}

interface ReadAppLaunchOptions extends AppLaunchOptions {
  app?: string;
  instance?: string;
  file?: string;
}

export type { AppLaunch, AppLaunchOptions, ReadAppLaunchOptions };
