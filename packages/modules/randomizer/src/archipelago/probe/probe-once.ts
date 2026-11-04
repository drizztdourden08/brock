/* @layer core @kind logic */
import { parseServerPackets } from '../handshake/parse-server-packets';
import type { ArchipelagoSocket } from '../protocol/socket.type';
import { createBrowserSocket } from '../socket/browser-socket';
import { PROBE_TIMEOUT_MS } from './probe.constants';
import type { AttemptResult } from './probe-attempt.type';
import type { ProbeConfig, ProbeResult } from './probe.type';
import { roomInfoResult } from './room-info-result';

const closeQuietly = (socket: ArchipelagoSocket): void => {
  try {
    socket.close();
  } catch {
    return undefined;
  }
};

const probeOnce = (url: string, config: ProbeConfig): Promise<AttemptResult> =>
  new Promise((resolve) => {
    const { game, createSocket = createBrowserSocket } = config;
    let settled = false;
    let opened = false;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let socket: ArchipelagoSocket;

    const finish = (result: ProbeResult): void => {
      if (settled) return;
      settled = true;
      if (timer != null) clearTimeout(timer);
      closeQuietly(socket);
      resolve({ result, opened });
    };

    try {
      socket = createSocket(url);
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      resolve({ result: { ok: false, reason: `invalid server URL: ${detail}` }, opened });
      return;
    }
    timer = setTimeout(
      () => finish({ ok: false, reason: `no room info within ${PROBE_TIMEOUT_MS / 1000}s` }),
      PROBE_TIMEOUT_MS,
    );

    socket.onOpen(() => {
      opened = true;
    });
    socket.onMessage((text) => {
      for (const packet of parseServerPackets(text)) {
        opened = true;
        if (packet.cmd === 'RoomInfo') finish(roomInfoResult(packet, url, game));
      }
    });
    socket.onClose(() => finish({ ok: false, reason: 'connection closed before the room info arrived' }));
  });

export { probeOnce };
