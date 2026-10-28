/* @layer electron-main @kind types */
interface NetHop {
  status: number;
  contentType: string | null;
  contentLength: number | null;
  location: string | null;
  body: AsyncIterable<Uint8Array> | null;
  close: () => void;
}

type NetTransport = (url: string, signal: AbortSignal) => Promise<NetHop>;

export type { NetHop, NetTransport };
