/* @layer renderer-shell @kind logic */
import type { PlatformInfo } from '@drizztdourden08/brock-core';
import { HOST_LABEL, NO_VALUE, OS_LABEL } from './diagnostics.constants';
import type { RuntimeLabels } from './diagnostics.type';

const versionIn = (userAgent: string, product: string): string | null =>
  new RegExp(`${product}/([\\d.]+)`).exec(userAgent)?.[1] ?? null;

const runtimeLabels = (info: PlatformInfo, userAgent: string): RuntimeLabels => {
  const electron = versionIn(userAgent, 'Electron');
  const chromium = versionIn(userAgent, 'Chrome');
  return {
    runtime: info.host === 'electron' && electron ? `Electron ${electron}` : HOST_LABEL[info.host],
    engine: chromium ? `Chromium ${chromium}` : NO_VALUE,
    platform: OS_LABEL[info.os],
  };
};

export { runtimeLabels };
