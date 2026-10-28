/* @layer electron-main @kind logic */
import type { NetReadWire } from '@drizztdourden08/brock-core/platform';
import type { ProductNet } from '@drizztdourden08/brock-core/product';
import { NET_HOPS, NET_TIMEOUT_MS, REDIRECTS } from './net-read.constants';
import { netOptions } from './net-options';
import type { NetHop, NetTransport } from './net-transport.type';
import { readAnswer } from './read-answer';
import { vetNetUrl } from './vet-net-url';

const nextAddress = (from: URL, hop: NetHop, hosts: readonly string[]): URL => {
  if (hop.location === null) throw new Error('net.read got a redirect with no address');
  let next: string;
  try {
    next = new URL(hop.location, from).href;
  } catch (error) {
    throw new Error('net.read got a redirect to a bad address', { cause: error });
  }
  return vetNetUrl(next, hosts);
};

const netRead = async (config: ProductNet | undefined, transport: NetTransport, address: unknown, options: unknown): Promise<NetReadWire> => {
  if (config === undefined) throw new Error('net.read is off: the product lists no hosts (product.net)');
  if (typeof address !== 'string') throw new Error('net.read needs a web address');
  const limits = netOptions(config, options);
  const signal = AbortSignal.timeout(NET_TIMEOUT_MS);
  let current = vetNetUrl(address, config.hosts);
  for (let hop = 0; hop <= NET_HOPS; hop += 1) {
    const answer = await transport(current.href, signal);
    try {
      if (!REDIRECTS.has(answer.status)) return await readAnswer(answer, config, limits, current);
      if (hop === NET_HOPS) throw new Error(`net.read followed ${NET_HOPS} redirects and stopped`);
      current = nextAddress(current, answer, config.hosts);
    } finally {
      answer.close();
    }
  }
  throw new Error('net.read stopped');
};

export { netRead };
