/* @layer core @kind logic */
import type { ApServerPacket } from '../protocol/server-packets.type';

const isPacket = (value: unknown): value is ApServerPacket =>
  typeof value === 'object' && value !== null && typeof (value as { cmd?: unknown }).cmd === 'string';

const parseServerPackets = (text: string): ApServerPacket[] => {
  try {
    const parsed: unknown = JSON.parse(text);
    return Array.isArray(parsed) ? parsed.filter(isPacket) : [];
  } catch {
    return [];
  }
};

export { parseServerPackets };
