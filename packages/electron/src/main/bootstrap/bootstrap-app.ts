/* @layer electron-main @kind logic */
import { app, session } from 'electron';
import type { ProductConfig } from '@drizztdourden08/brock-core/product';
import { createAutomationFlags } from '@drizztdourden08/brock-core/automation';
import type { BootstrapOptions } from '../types/main-context.type';
import type { WindowSetup } from '../window/window-setup.type';
import type { ReadyInput } from './bootstrap-app.type';
import { applyPortableMode } from '../app/portable-mode';
import { applyUserDataArg } from '../app/user-data-arg';
import { installCrashForensics } from '../crash-forensics/install';
import { noteSync } from '../crash-forensics/note-sync';
import { stackOf } from '../crash-forensics/stack-of';
import { parseInstanceConfig } from '../instance/instance-config';
import { applyAppIdentity } from '../instance/app-identity';
import { registerPrivilegedSchemes } from '../protocol/privileged-schemes';
import { initPaths } from '../paths/init-paths';
import { ensureDataDirectories } from '../paths/ensure-data-directories';
import { installDevFileLogging } from '../logs/dev-file-logger';
import { resolveWindowIcon } from '../window/window-icon';
import { createWindow } from '../window/create-window';
import { planWindow } from '../window/plan-window';
import { installEditMenu } from '../window/edit-menu';
import { rotateSessionLog } from '../handlers/rotate-session-log';
import { bootState } from '../boot/boot-state';
import { openSplash } from '../boot/open-splash';
import { runMainBoot } from '../boot/run-main-boot';
import { DEV_WATCHDOG_MS, WATCHDOG_MS } from '../boot/reveal.constants';
import { mainBootTasks } from '../boot/tasks/main-boot-tasks';
import { createMainContext } from './create-main-context';
import { resolvePaths } from './resolve-paths';
import { armScreenshotFlag } from './screenshot-flag';
import { armSplashScreenshotFlag } from './splash-screenshot-flag';
import { armReviewFlag } from './review-flag';
import { installAppLifecycle } from './app-lifecycle';
import { registerHandlerGroups } from './register-handlers';
import { widgetHandlers } from '../widgets/widget-handlers';
import { widgetWindowSetup } from '../widgets/widget-window-setup';
import { logBoot } from './boot-timing';
import { externalProtocols } from '../window/external-protocols';

const onReady = async ({ ctx, options, dataDirs, setup }: ReadyInput): Promise<void> => {
  const modules = options.modules ?? [];
  if (ctx.isDev) await session.defaultSession.clearCache();

  initPaths(app.getPath('userData'));
  await ensureDataDirectories(dataDirs);
  await rotateSessionLog();

  const plan = planWindow(setup);
  const { window: config } = setup.product;
  bootState.watchdogMs = ctx.isDev ? DEV_WATCHDOG_MS : WATCHDOG_MS;
  openSplash({
    plan,
    size: config.splash,
    title: plan.title,
    version: setup.version,
    backgroundColor: config.backgroundColor,
    icon: setup.icon,
    pagePath: setup.paths.splash,
    preloadPath: setup.paths.splashPreload,
  });
  logBoot('splash opened');
  armScreenshotFlag(ctx);
  armSplashScreenshotFlag(ctx);
  armReviewFlag(ctx, setup.icon);
  registerHandlerGroups([widgetHandlers(widgetWindowSetup(setup, plan))], ctx);

  const openWindow = async (): Promise<void> => {
    const win = createWindow(setup, plan);
    logBoot('window created');
    if (ctx.isDev) await installDevFileLogging(win);
    installEditMenu();
    for (const module of modules) module.onWindow?.(win, ctx);
    options.onWindow?.(win, ctx);
  };
  await runMainBoot(mainBootTasks(options, openWindow), ctx);
};

const bootstrapApp = (product: ProductConfig, options: BootstrapOptions = {}): void => {
  const modules = options.modules ?? [];
  for (const module of modules) module.onBoot?.(product);
  const portableData = applyPortableMode();
  const userDataOverride = applyUserDataArg();
  app.setName(product.id);
  installCrashForensics();

  const flags = createAutomationFlags([
    ...modules.flatMap((m) => m.automationFlags ?? []),
    ...(options.automationFlags ?? []),
  ]);
  const instance = parseInstanceConfig();
  if (options.security?.externalProtocols) externalProtocols.allowed = new Set(options.security.externalProtocols);
  const paths = resolvePaths(options.paths);
  const icon = resolveWindowIcon(paths.renderer, instance.name);
  applyAppIdentity(instance.name, { appId: product.appId, iconPath: icon });
  registerPrivilegedSchemes([...product.schemes, ...modules.flatMap((m) => m.schemes ?? [])]);
  app.commandLine.appendSwitch('disable-features', 'CalculateNativeWinOcclusion');

  const ctx = createMainContext({ product, flags, instance, profileHooks: options.profileHooks, dataDomains: options.dataDomains });
  const dataDirs = [...product.dataDirs, ...modules.flatMap((m) => m.dataDirs ?? [])];
  const setup: WindowSetup = {
    product, flags, instance, paths, icon,
    version: app.getVersion(),
    rendererFlags: options.rendererFlags,
    security: options.security,
  };

  if (portableData) ctx.log(`user data lives beside the app: ${portableData}`);
  if (userDataOverride) ctx.log(`user data redirected by flag: ${userDataOverride}`);

  void app.whenReady()
    .then(() => onReady({ ctx, options, dataDirs, setup }))
    .catch((err: unknown) => {
      noteSync('error', `boot failed: ${stackOf(err)}`);
      app.exit(1);
    });

  installAppLifecycle({ ctx, modules, onWillQuit: options.onWillQuit, recreateWindow: () => createWindow(setup, planWindow(setup)) });
};

export { bootstrapApp };
