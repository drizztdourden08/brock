/* @layer core @kind logic */
import type { ApServerPacket } from '../protocol/server-packets.type';

const isServerPacket = (value: unknown): value is ApServerPacket =>
  typeof value === 'object' && value !== null && typeof (value as { cmd?: unknown }).cmd === 'string';

const parseServerPackets = (raw: string): ApServerPacket[] => {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isServerPacket);
  } catch {
    return [];
  }
};

export { parseServerPackets };
