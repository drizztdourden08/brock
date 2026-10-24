/* @layer electron-main @kind test */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { embedServer } from '../src/main/server/embed-server';

const shared = vi.hoisted(() => ({ quit: [] as Array<() => void>, logs: [] as Array<[string, string]> }));

vi.mock('electron', () => ({
  app: { once: (_event: string, listener: () => void) => shared.quit.push(listener) },
}));

vi.mock('../src/main/logs/append-main-log', () => ({
  appendMainLog: (level: string, message: string) => shared.logs.push([level, message]),
}));

const ctx = { paths: { userData: () => '/app-data', data: () => '/app-data/Data' } };

describe('embedServer', () => {
  beforeEach(() => {
    shared.quit.length = 0;
    shared.logs.length = 0;
  });

  it('hands the start function the user data folder and a log into the main log', async () => {
    const seen: string[] = [];
    await embedServer((host) => {
      seen.push(host.dataDir);
      host.log('listening', 'warn');
      return { stop: () => undefined };
    }, ctx);
    expect(seen).toEqual(['/app-data']);
    expect(shared.logs).toContainEqual(['warn', 'listening']);
  });

  it('calls stop once when the app quits', async () => {
    const stop = vi.fn();
    const server = await embedServer(() => ({ stop }), ctx);
    shared.quit.forEach((listener) => listener());
    await server.stop();
    expect(stop).toHaveBeenCalledTimes(1);
  });

  it('builds the domains from the folder with the factory the app passes', async () => {
    const received: unknown[] = [];
    await embedServer<{ dir: string }>((host) => {
      received.push(host.domains);
      return { stop: () => undefined };
    }, ctx, { domains: (dir) => ({ dir }) });
    expect(received).toEqual([{ dir: '/app-data' }]);
  });
});
