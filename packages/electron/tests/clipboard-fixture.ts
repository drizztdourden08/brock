/* @layer electron-main @kind test */
import type { ClipboardBackend, ClipboardBundle } from '../src/main/clipboard/clipboard-backend.type';
import type { MainContext } from '../src/main/types/main-context.type';
import { registerClipboard } from '../src/main/clipboard/register-clipboard';

type Handler = (event: unknown, ...args: unknown[]) => unknown;
type Listener = (details: { isMainFrame: boolean; isSameDocument: boolean }) => void;

const u32 = (value: number): number[] => [(value >>> 24) & 255, (value >>> 16) & 255, (value >>> 8) & 255, value & 255];

const pngOf = (width: number, height: number): Uint8Array =>
  Uint8Array.from([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
    ...u32(13), 0x49, 0x48, 0x44, 0x52, ...u32(width), ...u32(height), 8, 6, 0, 0, 0, 0, 0, 0, 0,
    0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82,
  ]);

const wireOf = (bytes: Uint8Array): ArrayBuffer => bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;

interface Memory {
  text: string;
  png: Uint8Array | null;
  size: { width: number; height: number };
  buffers: Map<string, Uint8Array>;
}

interface FakeClipboard extends ClipboardBackend {
  memory: Memory;
  reads: string[];
  dropPrivates: boolean;
  version: number;
}

const fakeClipboard = (): FakeClipboard => {
  const memory: Memory = { text: '', png: null, size: { width: 0, height: 0 }, buffers: new Map() };
  const board: FakeClipboard = {
    memory,
    reads: [],
    dropPrivates: false,
    version: 0,
    readText: () => memory.text,
    readBuffer: (type) => {
      board.reads.push(type);
      return memory.buffers.get(type) ?? new Uint8Array(0);
    },
    readImage: () => (memory.png === null ? null : { ...memory.size, png: () => memory.png as Uint8Array }),
    write: (bundle: ClipboardBundle) => {
      memory.text = bundle.text ?? '';
      memory.png = bundle.png ?? null;
      memory.size = bundle.png === undefined ? { width: 0, height: 0 } : { width: 1, height: 1 };
      memory.buffers.clear();
      if (!board.dropPrivates) for (const item of bundle.privates) memory.buffers.set(item.type, item.data);
      board.version += 1;
    },
    fingerprint: () => `${board.version}`,
  };
  return board;
};

const APP_FRAME = { origin: 'file://', url: 'file:///app/index.html' };

interface FakeSender {
  mainFrame: typeof APP_FRAME;
  sent: string[];
  destroyed: boolean;
  isDestroyed: () => boolean;
  send: (channel: string, ...args: unknown[]) => void;
  extras: unknown[][];
  on: (name: string, listener: (...args: never[]) => void) => void;
  fire: (name: string, ...args: unknown[]) => void;
}

const senderOf = (): FakeSender => {
  const listeners = new Map<string, ((...args: unknown[]) => void)[]>();
  const sender: FakeSender = {
    mainFrame: APP_FRAME,
    sent: [],
    extras: [],
    destroyed: false,
    isDestroyed: () => sender.destroyed,
    send: (channel, ...args) => {
      sender.sent.push(channel);
      sender.extras.push(args);
    },
    on: (name, listener) => listeners.set(name, [...(listeners.get(name) ?? []), listener as (...args: unknown[]) => void]),
    fire: (name, ...args) => (listeners.get(name) ?? []).forEach((listener) => listener(...args)),
  };
  return sender;
};

const eventOf = (sender: FakeSender, frame: unknown = sender.mainFrame): { sender: FakeSender; senderFrame: unknown } => ({ sender, senderFrame: frame });

interface Session {
  call: (channel: string, ...args: unknown[]) => Promise<unknown>;
  callFrom: (event: unknown, channel: string, ...args: unknown[]) => Promise<unknown>;
  sender: FakeSender;
  emitted: string[];
  extras: unknown[][];
  navigate: (sender?: FakeSender) => void;
}

const sessionOf = (board: ClipboardBackend, productId = 'bxel'): Session => {
  const handlers = new Map<string, Handler>();
  const sender = senderOf();
  const ctx: Pick<MainContext, 'handle' | 'product'> = {
    product: { id: productId } as MainContext['product'],
    handle: ((channel: string, fn: Handler) => handlers.set(channel, fn)) as MainContext['handle'],
  };
  registerClipboard(ctx, board);
  const callFrom = (event: unknown, channel: string, ...args: unknown[]): Promise<unknown> => Promise.resolve().then(() => handlers.get(channel)?.(event, ...args));
  return {
    call: (channel, ...args) => callFrom(eventOf(sender), channel, ...args),
    callFrom,
    sender,
    get emitted() {
      return sender.sent;
    },
    get extras() {
      return sender.extras;
    },
    navigate: (who = sender) => who.fire('did-start-navigation', { isMainFrame: true, isSameDocument: false } satisfies Parameters<Listener>[0]),
  };
};

export { eventOf, fakeClipboard, pngOf, senderOf, sessionOf, wireOf };
