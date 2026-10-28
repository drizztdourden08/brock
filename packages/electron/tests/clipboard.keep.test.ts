/* @layer electron-main @kind test */
import { describe, expect, it, vi } from 'vitest';
import { eventOf, fakeClipboard, pngOf, senderOf, sessionOf, wireOf } from './clipboard-fixture';

vi.mock('../src/main/window/dev-server-url', () => ({ devServerUrl: () => null }));

const own = 'application/x-bxel-clip';

describe('clipboard round trip', () => {
  it('writes and reads a PNG, a private type and text together', async () => {
    const board = fakeClipboard();
    const { call } = sessionOf(board);
    const png = pngOf(4, 3);
    const clip = Uint8Array.from([1, 2, 3, 4]);
    await call('clipboard:write', { 'image/png': wireOf(png), [own]: wireOf(clip), 'text/plain': 'hello' });
    const back = (await call('clipboard:read', ['image/png', own, 'text/plain'])) as Record<string, ArrayBuffer | string>;
    expect(new Uint8Array(back['image/png'] as ArrayBuffer)).toEqual(png);
    expect(new Uint8Array(back[own] as ArrayBuffer)).toEqual(clip);
    expect(back['text/plain']).toBe('hello');
    expect(await call('clipboard:readText')).toBe('hello');
  });

  it('leaves out a type that is not on the clipboard', async () => {
    const { call } = sessionOf(fakeClipboard());
    expect(await call('clipboard:read', ['image/png', own, 'text/plain'])).toEqual({});
    expect(await call('clipboard:readText')).toBe('');
  });

  it('compares text without caring about line ending style', async () => {
    const board = fakeClipboard();
    const { call } = sessionOf(board);
    await call('clipboard:write', { 'text/plain': 'a\nb' });
    board.memory.text = 'a\r\nb';
    await expect(call('clipboard:write', { 'text/plain': 'a\nb' })).resolves.toBeUndefined();
  });
});

describe('clipboard write refusals', () => {
  const refuse = async (entries: unknown, message: RegExp): Promise<void> => {
    const board = fakeClipboard();
    const { call } = sessionOf(board);
    await call('clipboard:write', { 'text/plain': 'keep' });
    await expect(call('clipboard:write', entries)).rejects.toThrow(message);
    expect(board.memory.text).toBe('keep');
  };

  it('refuses a type outside text, PNG and the product namespace', async () => {
    for (const type of ['text/html', 'image/jpeg', 'application/x-other-clip', 'application/x-bxel', 'application/x-bxel-', 'application/x-bxelx-clip', 'IMAGE/PNG', 'Text/Plain', 'x', '', '__proto__', 'application/x-bxel-Clip', 'application/x-bxel-../x', 'application/x-bxel-pro-clip', 'application/x-bxel-a-b']) {
      await refuse({ [type]: wireOf(Uint8Array.from([1])) }, /not allowed/);
    }
  });

  it('refuses a request that mixes an allowed type with a refused one, and writes nothing', async () => {
    await refuse({ 'text/plain': 'new', 'text/html': '<b>x</b>' }, /not allowed/);
  });

  it('refuses a body that is not an object, is empty or has too many types', async () => {
    for (const bad of [null, 'text', 5, [], {}, Object.fromEntries(Array.from({ length: 9 }, (_, index) => [`application/x-bxel-t${index}`, wireOf(Uint8Array.from([1]))]))]) {
      await refuse(bad, /needs/);
    }
  });

  it('refuses values of the wrong kind', async () => {
    await refuse({ 'text/plain': wireOf(Uint8Array.from([1])) }, /needs a string/);
    await refuse({ [own]: 'text' }, /needs bytes/);
    await refuse({ [own]: Uint8Array.from([1]) }, /needs bytes/);
    await refuse({ [own]: new ArrayBuffer(0) }, /no bytes/);
    await refuse({ 'image/png': 'text' }, /needs bytes/);
  });

  it('refuses a PNG that is not whole or is too large to decode', async () => {
    const chopped = pngOf(2, 2).slice(0, 40);
    const noEnd = pngOf(2, 2);
    noEnd[noEnd.length - 1] = 0;
    const badSignature = pngOf(2, 2);
    badSignature[1] = 0x51;
    const badHeader = pngOf(2, 2);
    badHeader[12] = 0x58;
    for (const bytes of [chopped, noEnd, badSignature, badHeader, pngOf(0, 4), pngOf(4, 0), pngOf(16385, 1), pngOf(1, 16385), pngOf(10000, 10000), Uint8Array.from([1, 2, 3])]) {
      await refuse({ 'image/png': wireOf(bytes) }, /not a whole PNG/);
    }
  });

  it('refuses bytes over the size limit and text over the character limit', async () => {
    await refuse({ [own]: new ArrayBuffer(32 * 1024 * 1024 + 1) }, /over the .* byte limit/);
    await refuse({ 'text/plain': 'x'.repeat(4 * 1024 * 1024 + 1) }, /character limit/);
  });

  it('refuses a write when the clipboard did not keep a type', async () => {
    const board = fakeClipboard();
    board.dropPrivates = true;
    const { call } = sessionOf(board);
    await expect(call('clipboard:write', { 'text/plain': 'x', [own]: wireOf(Uint8Array.from([9])) })).rejects.toThrow(/did not keep/);
  });

  it('uses the product id of the running app for its namespace', async () => {
    const { call } = sessionOf(fakeClipboard(), 'other-app');
    await expect(call('clipboard:write', { [own]: wireOf(Uint8Array.from([1])) })).rejects.toThrow(/not allowed/);
    await expect(call('clipboard:write', { 'application/x-other-app-clip': wireOf(Uint8Array.from([1])) })).resolves.toBeUndefined();
  });
});

describe('clipboard read refusals', () => {
  it('never reads another app private format, and does not touch it', async () => {
    const board = fakeClipboard();
    board.memory.buffers.set('application/x-secret-notes', Uint8Array.from([7, 7]));
    board.memory.buffers.set('application/x-other-clip', Uint8Array.from([7, 7]));
    const { call } = sessionOf(board);
    for (const type of ['application/x-secret-notes', 'application/x-other-clip', 'text/html', 'CF_HDROP', 'files', '']) {
      await expect(call('clipboard:read', [type]), type).rejects.toThrow(/not allowed/);
      await expect(call('clipboard:read', ['text/plain', type]), type).rejects.toThrow(/not allowed/);
    }
    expect(board.reads).toEqual([]);
  });

  it('refuses a list that is not a list of strings, is empty or is long', async () => {
    const { call } = sessionOf(fakeClipboard());
    for (const bad of [undefined, 'text/plain', [], [5], [null], Array.from({ length: 9 }, (_, index) => `application/x-bxel-t${index}`)]) {
      await expect(call('clipboard:read', bad)).rejects.toThrow();
    }
  });

  it('refuses to hand over data over the size cap', async () => {
    const board = fakeClipboard();
    const { call } = sessionOf(board);
    board.memory.buffers.set(own, new Uint8Array(32 * 1024 * 1024 + 1));
    await expect(call('clipboard:read', [own])).rejects.toThrow(/over the .* byte limit/);
    board.memory.text = 'x'.repeat(4 * 1024 * 1024 + 1);
    await expect(call('clipboard:readText')).rejects.toThrow(/character limit/);
    await expect(call('clipboard:read', ['text/plain'])).rejects.toThrow(/character limit/);
    board.memory.png = pngOf(2, 2);
    board.memory.size = { width: 20000, height: 2 };
    await expect(call('clipboard:read', ['image/png'])).rejects.toThrow(/over the size limit/);
    board.memory.size = { width: 9000, height: 9000 };
    await expect(call('clipboard:read', ['image/png'])).rejects.toThrow(/over the size limit/);
  });
});

describe('clipboard product namespace', () => {
  it('keeps bxel apart from a product whose id starts with bxel-', async () => {
    const bxel = sessionOf(fakeClipboard(), 'bxel');
    const pro = sessionOf(fakeClipboard(), 'bxel-pro');
    const bytes = wireOf(Uint8Array.from([1]));
    await expect(bxel.call('clipboard:write', { 'application/x-bxel-pro-clip': bytes })).rejects.toThrow(/not allowed/);
    await expect(bxel.call('clipboard:read', ['application/x-bxel-pro-clip'])).rejects.toThrow(/not allowed/);
    await expect(pro.call('clipboard:write', { 'application/x-bxel-pro-clip': bytes })).resolves.toBeUndefined();
    await expect(pro.call('clipboard:write', { 'application/x-bxel-clip': bytes })).rejects.toThrow(/not allowed/);
    await expect(pro.call('clipboard:read', ['application/x-bxel-clip'])).rejects.toThrow(/not allowed/);
  });
});

describe('clipboard channels check the frame', () => {
  const calls: [string, ...unknown[]][] = [
    ['clipboard:readText'],
    ['clipboard:read', ['text/plain']],
    ['clipboard:write', { 'text/plain': 'x' }],
    ['clipboard:watch', 'w'],
    ['clipboard:unwatch', 'w'],
  ];

  it('refuses a call with no frame, from a sub frame and from a page that is not the app', async () => {
    const board = fakeClipboard();
    const session = sessionOf(board);
    const sender = senderOf();
    const events = [
      eventOf(sender, null),
      eventOf(sender, { origin: 'file://', url: 'file:///other.html' }),
      eventOf(sender, { origin: 'https://evil.example', url: 'https://evil.example/' }),
      eventOf(sender, { origin: 'null', url: 'data:text/html,hi' }),
    ];
    for (const event of events) {
      for (const [channel, ...args] of calls) await expect(session.callFrom(event, channel, ...args), channel).rejects.toThrow(/Only the app window/);
    }
    expect(board.memory.text).toBe('');
    expect(board.reads).toEqual([]);
    expect(sender.sent).toEqual([]);
  });

  it('accepts the app frame of any window', async () => {
    const session = sessionOf(fakeClipboard());
    const widget = senderOf();
    await expect(session.callFrom(eventOf(widget), 'clipboard:write', { 'text/plain': 'x' })).resolves.toBeUndefined();
    await expect(session.callFrom(eventOf(widget), 'clipboard:readText')).resolves.toBe('x');
  });
});
