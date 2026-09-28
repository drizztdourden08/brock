/* @layer renderer-shell @kind test */
import { describe, expect, it } from 'vitest';
import type { LogEntry, PlatformInfo, SystemDiagnostics } from '@drizztdourden08/brock-core';
import { buildDebugText } from '../src/diagnostics/build-debug-text';
import { formatLogLine } from '../src/diagnostics/format-log-line';
import { runtimeLabels } from '../src/diagnostics/runtime-labels';

const INFO: PlatformInfo = { host: 'electron', os: 'windows', formFactor: 'desktop', input: 'pointer', isDev: false };
const AGENT = 'Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 Chrome/140.0.1.2 Electron/38.1.0 Safari/537.36';

const SYSTEM: SystemDiagnostics = {
  os: {
    platform: 'win32', version: 'Windows 11 Home', release: '10.0.26200', arch: 'x64', uptimeSeconds: 7400,
    locale: 'en-CA', systemLocale: 'en-CA', preferredLanguages: ['en-CA'], timeZone: 'America/Toronto', onBattery: false,
  },
  cpu: { model: 'Test CPU', logicalCores: 16, speedMhz: 3600, arch: 'x64' },
  memory: { totalBytes: 32 * 1024 ** 3, freeBytes: 16 * 1024 ** 3, swapTotalBytes: null, swapFreeBytes: null },
  gpu: {
    devices: [], glVendor: null, glRenderer: null, glVersion: null, driverVersion: null,
    hardwareAccelerated: true, features: { webgl: 'enabled', vulkan: 'disabled_off' },
  },
  displays: [],
  versions: { node: '24.0.0', v8: '14.0', chrome: '140.0', electron: '38.1.0' },
};

const log = (id: number, message: string): LogEntry => ({ id, timestamp: 0, channel: 'app', level: 'warn', message });

describe('runtimeLabels', () => {
  it('reads the Electron and Chromium versions from the user agent', () => {
    expect(runtimeLabels(INFO, AGENT)).toEqual({ runtime: 'Electron 38.1.0', engine: 'Chromium 140.0.1.2', platform: 'Windows' });
  });

  it('falls back to the host name and a dash', () => {
    expect(runtimeLabels({ ...INFO, host: 'web', os: 'linux' }, 'curl/8')).toEqual({ runtime: 'Web', engine: '-', platform: 'Linux' });
  });
});

describe('formatLogLine', () => {
  it('writes level, channel and message and cuts a long line', () => {
    const line = formatLogLine(log(1, 'a'.repeat(50)), 30);
    expect(line).toMatch(/^\d\d:\d\d:\d\d WARN \[app\] a+\.\.\.$/);
    expect(line).toHaveLength(33);
  });
});

describe('buildDebugText', () => {
  const text = buildDebugText({
    productName: 'My App',
    version: '1.2.3',
    labels: runtimeLabels(INFO, AGENT),
    info: INFO,
    system: SYSTEM,
    window: null,
    logs: Array.from({ length: 40 }, (_, i) => log(i, `line ${i}`)),
    userAgent: AGENT,
  });

  it('opens with the identity header', () => {
    expect(text.startsWith('My App debug info\nVersion: 1.2.3\nRuntime: Electron 38.1.0')).toBe(true);
  });

  it('keeps only the recent log tail', () => {
    expect(text).toContain('[Recent log (30 of 40)]');
    expect(text).toContain('line 39');
    expect(text).not.toContain('line 9\n');
  });

  it('adds the host sections and names the features that are not accelerated', () => {
    expect(text).toContain('[CPU and memory]');
    expect(text).toContain('RAM: 32.0 GiB total, 16.0 GiB free');
    expect(text).toContain('Not accelerated: vulkan=disabled_off');
    expect(text).toContain('Uptime: 2h 3m');
    expect(text).not.toContain('[Displays');
  });
});
