/* @layer electron-main @kind test */
import { describe, expect, it, vi } from 'vitest';
import type { ProductNet } from '@drizztdourden08/brock-core/product';
import { netRead } from '../src/main/network/net-read';
import type { NetHop, NetTransport } from '../src/main/network/net-transport.type';

const config: ProductNet = { hosts: ['lospec.com', 'cdn.lospec.com'], contentTypes: ['application/json', 'text/*', 'image/png'], maxBytes: 1000 };

const ones = (count: number): number[] => Array.from({ length: count }, () => 1);

const body = (...parts: number[][]): AsyncIterable<Uint8Array> => ({
  async *[Symbol.asyncIterator]() {
    await Promise.resolve();
    for (const part of parts) yield Uint8Array.from(part);
  },
});

const answer = (extra: Partial<NetHop> = {}): NetHop => ({ status: 200, contentType: 'application/json', contentLength: null, encoded: false, location: null, body: body([123, 125]), close: vi.fn(), ...extra });

const sequence = (...hops: NetHop[]): { transport: NetTransport; urls: string[] } => {
  const urls: string[] = [];
  const queue = [...hops];
  return {
    urls,
    transport: (url) => {
      urls.push(url);
      const next = queue.shift();
      return next === undefined ? Promise.reject(new Error('unexpected request')) : Promise.resolve(next);
    },
  };
};

const redirect = (location: string | null, status = 302): NetHop => answer({ status, location, body: null, contentType: null });

describe('net.read', () => {
  it('reads an answer from a listed host over https', async () => {
    const hop = answer({ contentType: 'Application/JSON; charset=utf-8' });
    const { transport, urls } = sequence(hop);
    const result = await netRead(config, transport, 'https://lospec.com/palette-list/pico-8.json', undefined);
    expect(new Uint8Array(result.bytes)).toEqual(Uint8Array.from([123, 125]));
    expect(result).toMatchObject({ contentType: 'application/json', url: 'https://lospec.com/palette-list/pico-8.json' });
    expect(urls).toEqual(['https://lospec.com/palette-list/pico-8.json']);
    expect(hop.close).toHaveBeenCalled();
  });

  it('matches the host without caring about case', async () => {
    const { transport, urls } = sequence(answer());
    await netRead(config, transport, 'https://LOSPEC.com/x.json', undefined);
    expect(urls).toEqual(['https://lospec.com/x.json']);
  });
});

describe('net.read refuses before any request', () => {
  const refuse = async (address: unknown, message: RegExp, cfg: ProductNet | null | 'default' = 'default'): Promise<void> => {
    const { transport, urls } = sequence(answer());
    await expect(netRead(cfg === 'default' ? config : (cfg ?? undefined), transport, address, undefined), String(address)).rejects.toThrow(message);
    expect(urls).toEqual([]);
  };

  it('is off when the product lists no hosts', async () => {
    await refuse('https://lospec.com/x.json', /is off/, null);
  });

  it('refuses a host the product does not list, however it is spelled', async () => {
    for (const address of [
      'https://example.com/x', 'https://lospec.com.evil.com/x', 'https://evil-lospec.com/x', 'https://sub.cdn.lospec.com/x', 'https://notlospec.com/x',
      'https://lospec.com./x', 'https://127.0.0.1/x', 'https://[::1]/x', 'https://localhost/x', 'https://2130706433/x', 'https://lospec.com@evil.com/x',
    ]) await refuse(address, /not allowed to reach|user name|bad|needs a full/);
  });

  it('refuses anything but https', async () => {
    for (const address of ['http://lospec.com/x', 'ftp://lospec.com/x', 'file:///C:/x', 'data:text/plain,hi', 'javascript:alert(1)', 'ws://lospec.com/x', '//lospec.com/x']) {
      await refuse(address, /only fetches https|needs a full/);
    }
  });

  it('refuses a user name, a password and a port', async () => {
    await refuse('https://user:pass@lospec.com/x', /user name or password/);
    await refuse('https://user@lospec.com/x', /user name or password/);
    await refuse('https://lospec.com:8443/x', /standard https port/);
    await refuse('https://lospec.com:80/x', /standard https port/);
  });

  it('refuses an address that is not a string and bad options', async () => {
    for (const address of [undefined, 5, null, {}, '', 'not a url']) await refuse(address, /needs a (web address|full web address)/);
    for (const options of ['x', 5]) {
      await expect(netRead(config, sequence(answer()).transport, 'https://lospec.com/x', options)).rejects.toThrow(/options/);
    }
    for (const maxBytes of [0, -1, 1.5, '10', Number.NaN]) {
      await expect(netRead(config, sequence(answer()).transport, 'https://lospec.com/x', { maxBytes }), String(maxBytes)).rejects.toThrow(/maxBytes/);
    }
    for (const types of [[], 'text/plain', ['nope'], [5], ['TEXT/PLAIN']]) {
      await expect(netRead(config, sequence(answer()).transport, 'https://lospec.com/x', { types }), JSON.stringify(types)).rejects.toThrow(/types must be/);
    }
  });
});

describe('net.read redirects', () => {
  it('follows redirects between listed hosts, including a relative one', async () => {
    const { transport, urls } = sequence(redirect('https://cdn.lospec.com/a.json'), redirect('/b.json', 301), answer());
    const result = await netRead(config, transport, 'https://lospec.com/x', undefined);
    expect(urls).toEqual(['https://lospec.com/x', 'https://cdn.lospec.com/a.json', 'https://cdn.lospec.com/b.json']);
    expect(result.url).toBe('https://cdn.lospec.com/b.json');
  });

  it('refuses a redirect to a host the product does not list, and never requests it', async () => {
    for (const location of ['https://evil.com/x', 'https://lospec.com.evil.com/x', 'http://lospec.com/x', 'https://127.0.0.1/x', 'https://user:pw@lospec.com/x', 'https://lospec.com:444/x', 'data:text/plain,hi']) {
      const { transport, urls } = sequence(redirect(location), answer());
      await expect(netRead(config, transport, 'https://lospec.com/x', undefined), location).rejects.toThrow();
      expect(urls, location).toEqual(['https://lospec.com/x']);
    }
  });

  it('checks every hop, not only the first', async () => {
    const { transport, urls } = sequence(redirect('https://cdn.lospec.com/a'), redirect('https://evil.com/b'), answer());
    await expect(netRead(config, transport, 'https://lospec.com/x', undefined)).rejects.toThrow(/not allowed to reach "evil.com"/);
    expect(urls).toEqual(['https://lospec.com/x', 'https://cdn.lospec.com/a']);
  });

  it('stops after five redirects and refuses a redirect with no address', async () => {
    const loop = Array.from({ length: 6 }, () => redirect('https://lospec.com/again'));
    await expect(netRead(config, sequence(...loop).transport, 'https://lospec.com/x', undefined)).rejects.toThrow(/followed 5 redirects/);
    await expect(netRead(config, sequence(redirect(null)).transport, 'https://lospec.com/x', undefined)).rejects.toThrow(/no address/);
  });

  it('closes every hop it opened', async () => {
    const first = redirect('https://cdn.lospec.com/a');
    const second = answer();
    await netRead(config, sequence(first, second).transport, 'https://lospec.com/x', undefined);
    expect(first.close).toHaveBeenCalled();
    expect(second.close).toHaveBeenCalled();
  });
});

describe('net.read answers', () => {
  const refuse = (hop: NetHop, message: RegExp, options?: unknown): Promise<void> =>
    expect(netRead(config, sequence(hop).transport, 'https://lospec.com/x', options)).rejects.toThrow(message);

  it('refuses a status other than 200 and closes the answer', async () => {
    const hop = answer({ status: 404 });
    await refuse(hop, /status 404/);
    expect(hop.close).toHaveBeenCalled();
    await refuse(answer({ status: 204 }), /status 204/);
    await refuse(answer({ status: 500 }), /status 500/);
  });

  it('refuses a content type the product does not list or an answer with none', async () => {
    await refuse(answer({ contentType: 'image/svg+xml' }), /svg/);
    await refuse(answer({ contentType: 'application/octet-stream' }), /octet-stream/);
    await refuse(answer({ contentType: 'application/x-msdownload' }), /x-msdownload/);
    await refuse(answer({ contentType: null }), /no content type/);
    await refuse(answer({ contentType: '' }), /no content type/);
  });

  it('accepts a listed wildcard and narrows to the types the caller asks for', async () => {
    const ok = await netRead(config, sequence(answer({ contentType: 'text/csv' })).transport, 'https://lospec.com/x', undefined);
    expect(ok.contentType).toBe('text/csv');
    await refuse(answer({ contentType: 'text/csv' }), /text\/csv/, { types: ['application/json'] });
    await refuse(answer({ contentType: 'image/png' }), /image\/png/, { types: ['text/*'] });
    const narrowed = await netRead(config, sequence(answer({ contentType: 'image/png' })).transport, 'https://lospec.com/x', { types: ['image/png'] });
    expect(narrowed.contentType).toBe('image/png');
  });

  it('cannot widen the product list with the types a caller asks for', async () => {
    await refuse(answer({ contentType: 'application/zip' }), /application\/zip/, { types: ['application/zip'] });
  });

  it('refuses an answer whose length header is over the cap, without reading it', async () => {
    const read = vi.fn();
    const hop = answer({ contentLength: 1001, body: { [Symbol.asyncIterator]: () => ({ next: () => { read(); return Promise.resolve({ done: true, value: undefined }); } }) } });
    await refuse(hop, /over 1000 bytes/);
    expect(read).not.toHaveBeenCalled();
  });

  it('stops a body that grows past the cap even when no length was sent or it lied', async () => {
    await refuse(answer({ contentLength: null, body: body(ones(600), ones(600)) }), /over 1000 bytes/);
    await refuse(answer({ contentLength: 10, body: body(ones(1500)) }), /over 1000 bytes/);
  });

  it('takes the smaller of the product cap and the caller cap', async () => {
    await refuse(answer({ body: body(ones(60)) }), /over 50 bytes/, { maxBytes: 50 });
    await refuse(answer({ body: body(ones(1200)) }), /over 1000 bytes/, { maxBytes: 999999 });
    const fits = await netRead(config, sequence(answer({ body: body(ones(1000)) })).transport, 'https://lospec.com/x', { maxBytes: 999999 });
    expect(fits.bytes.byteLength).toBe(1000);
  });

});

describe('net.read failures', () => {
  const refuse = (hop: NetHop, message: RegExp): Promise<void> => expect(netRead(config, sequence(hop).transport, 'https://lospec.com/x', undefined)).rejects.toThrow(message);

  it('refuses a body that ends short of its length header, unless the answer was encoded', async () => {
    await refuse(answer({ contentLength: 5, body: body([1, 2, 3]) }), /ended after 3 of 5 bytes/);
    const encoded = await netRead(config, sequence(answer({ contentLength: 5, encoded: true, body: body([1, 2, 3]) })).transport, 'https://lospec.com/x', undefined);
    expect(encoded.bytes.byteLength).toBe(3);
    const whole = await netRead(config, sequence(answer({ contentLength: 3, body: body([1, 2, 3]) })).transport, 'https://lospec.com/x', undefined);
    expect(whole.bytes.byteLength).toBe(3);
  });

  it('rejects when the body stream fails part way, and closes the answer', async () => {
    const hop = answer({ body: { [Symbol.asyncIterator]: () => ({ next: () => Promise.reject(new Error('net.read stopped: the connection was cut')) }) } });
    await refuse(hop, /connection was cut/);
    expect(hop.close).toHaveBeenCalled();
  });

  it('passes a failing transport on', async () => {
    const transport: NetTransport = () => Promise.reject(new Error('socket hang up'));
    await expect(netRead(config, transport, 'https://lospec.com/x', undefined)).rejects.toThrow(/socket hang up/);
  });
});
