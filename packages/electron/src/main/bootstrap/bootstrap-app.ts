/* @layer electron-main @kind logic */
import nodeCrypto from 'node:crypto';
import { app } from 'electron';
import type { ProductConfig } from '@drizztdourden08/brock-core/product';
import { composeProfileHooks } from '@drizztdourden08/brock-core/storage';
import type { BootstrapOptions } from '../types/main-context.type';
import type { WindowSetup } from '../window/window-setup.type';
import type { ReadyInput } from './bootstrap-app.type';
import { installEcNullDigest } from '../compat/install-ec-null-digest';
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
import { watchdogMsOf } from '../boot/watchdog-ms';
import { warnBootTimeout } from '../boot/warn-boot-timeout';
import { mainBootTasks } from '../boot/tasks/main-boot-tasks';
import { createMainContext } from './create-main-context';
import { resolvePaths } from './resolve-paths';
import { armScreenshotFlag } from './screenshot-flag';
import { armSplashScreenshotFlag } from './splash-screenshot-flag';
import { armReviewFlag } from './review-flag';
import { pinReviewRendering } from '../review/baselines/pin-review-rendering';
import { pinHeadlessRendering } from '../window/pin-headless-rendering';
import { installAppLifecycle } from './app-lifecycle';
import { registerHandlerGroups } from './register-handlers';
import { widgetHandlers } from '../widgets/widget-handlers';
import { widgetWindowSetup } from '../widgets/widget-window-setup';
import { logBoot } from './boot-timing';
import { refreshDevCache } from './dev-cache';
import { allowExternalProtocols } from './allow-external-protocols';
import { logUserDataSource } from './log-user-data-source';
import { startProcess } from './start-process';
import { startOpenRouting } from '../open/start-open-routing';
import { armWindow } from '../background/arm-window';
import { startProductTray } from '../tray/start-product-tray';
import { bugReportTransport } from '../bug-report/bug-report-transport';
import { fileGuard } from '../files/file-guard-state';
import { bridgeKeyOf } from '../bridge/bridge-key';
import { opensBridgeOnBoot } from './opens-bridge-on-boot';
import { createMainI18n } from '../i18n/create-main-i18n';
import { installMainI18n } from '../i18n/install-main-i18n';
import { offeredTags } from '../i18n/offered-tags';
import { watchLocale } from '../i18n/watch-locale';

const onReady = async ({ ctx, options, dataDirs, schemes, setup }: ReadyInput): Promise<void> => {
  const modules = options.modules ?? [];
  if (ctx.isDev) logBoot(await refreshDevCache(app.getPath('userData')) ? 'dev cache cleared' : 'dev cache kept');

  initPaths(app.getPath('userData'));
  await ensureDataDirectories(dataDirs);
  await rotateSessionLog();
  startOpenRouting(ctx, options, schemes);
  bugReportTransport.current = options.bugReport ?? null;
  fileGuard.current = options.fileGuard ?? null;

  const plan = planWindow(setup);
  const { window: config } = setup.product;
  bootState.watchdogMs = watchdogMsOf(ctx.isDev, setup.product.boot);
  if (!ctx.flags.isBackgroundLaunch()) {
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
  }
  watchLocale(ctx.i18n);
  warnBootTimeout(ctx);
  armScreenshotFlag(ctx, options.screenshotTimeoutMs);
  armSplashScreenshotFlag(ctx);
  armReviewFlag(ctx, setup.icon);
  registerHandlerGroups([widgetHandlers(widgetWindowSetup(setup, plan))], ctx);

  const openWindow = async (): Promise<void> => {
    const win = createWindow(setup, planWindow(setup));
    logBoot('window created');
    if (ctx.isDev) await installDevFileLogging(win);
    installEditMenu();
    for (const module of modules) module.onWindow?.(win, ctx);
    options.onWindow?.(win, ctx);
  };
  startProductTray(ctx);
  await runMainBoot(mainBootTasks(options, armWindow(ctx, options, openWindow)), ctx);
  if (!opensBridgeOnBoot(options.bridge, ctx.bridge.extensionsAskForBoot()) || !bootState.mainDone) return;
  await ctx.bridge.open().catch((error: unknown) => ctx.log(`the bridge did not open: ${stackOf(error)}`, 'error'));
};

const bootstrapApp = (product: ProductConfig, options: BootstrapOptions = {}): void => {
  const start = startProcess(product, options);
  if (!start) return;
  const { flags, portableData, userDataOverride } = start;
  const modules = options.modules ?? [];
  installCrashForensics();
  installEcNullDigest(nodeCrypto, {
    enabled: options.ecNullDigestShim,
    onInstalled: (message) => noteSync('log', message),
  });
  const instance = parseInstanceConfig();
  allowExternalProtocols(options);
  const paths = resolvePaths(options.paths);
  const icon = resolveWindowIcon(paths.renderer, instance.name);
  applyAppIdentity(instance.name, { appId: product.appId, iconPath: icon });
  const schemes = [...product.schemes, ...modules.flatMap((m) => m.schemes ?? [])];
  registerPrivilegedSchemes(schemes);
  app.commandLine.appendSwitch('disable-features', 'CalculateNativeWinOcclusion');
  pinHeadlessRendering(flags);
  pinReviewRendering(flags);

  installMainI18n(createMainI18n(options.locales), offeredTags(options.locales));
  const ctx = createMainContext({
    product, flags, instance, profileHooks: composeProfileHooks([...modules.map((m) => m.profileHooks), options.profileHooks]), dataDomains: options.dataDomains, icon,
    bridge: { options: options.bridge ?? null, key: bridgeKeyOf(instance.name, userDataOverride ?? portableData) },
  });
  const dataDirs = [...product.dataDirs, ...modules.flatMap((m) => m.dataDirs ?? [])];
  const setup: WindowSetup = {
    product, flags, instance, paths, icon,
    version: app.getVersion(),
    rendererFlags: options.rendererFlags,
    security: options.security,
  };

  for (const module of modules) module.beforeReady?.(ctx);
  logUserDataSource(ctx, portableData, userDataOverride);

  void app.whenReady()
    .then(() => onReady({ ctx, options, dataDirs, schemes, setup }))
    .catch((err: unknown) => {
      noteSync('error', `boot failed: ${stackOf(err)}`);
      app.exit(1);
    });

  installAppLifecycle({ ctx, modules, onWillQuit: options.onWillQuit, recreateWindow: () => createWindow(setup, planWindow(setup)) });
};

export { bootstrapApp };
