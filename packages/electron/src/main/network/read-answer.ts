/* @layer electron-main @kind logic */
import type { NetReadWire } from '@drizztdourden08/brock-core/platform';
import type { ProductNet } from '@drizztdourden08/brock-core/product';
import { netTypeAllowed } from './net-type-allowed';
import type { NetHop } from './net-transport.type';
import type { NetLimits } from './net-options.type';
import { readCappedBody } from './read-capped-body';

const readAnswer = async (answer: NetHop, config: ProductNet, limits: NetLimits, address: URL): Promise<NetReadWire> => {
  if (answer.status !== 200) throw new Error(`net.read got status ${answer.status} from "${address.hostname}"`);
  const contentType = netTypeAllowed(answer.contentType, config.contentTypes, limits.types);
  if (answer.contentLength !== null && answer.contentLength > limits.maxBytes) throw new Error(`net.read stopped: the answer is over ${limits.maxBytes} bytes`);
  const bytes = await readCappedBody(answer.body, limits.maxBytes);
  if (answer.contentLength !== null && !answer.encoded && bytes.length !== answer.contentLength) throw new Error(`net.read stopped: the answer ended after ${bytes.length} of ${answer.contentLength} bytes`);
  return { bytes: bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer, contentType, url: address.href };
};

export { readAnswer };
