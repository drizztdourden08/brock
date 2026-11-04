/* @layer core @kind types */
interface OpusPacket {
  data: Uint8Array;
  samples: number;
}

export type { OpusPacket };
