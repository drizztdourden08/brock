/* @layer renderer-shell @kind logic */
import type { EffectQuery, PortTag } from './effect-query.type';

const parseEffectQuery = (filter: string, ports: readonly PortTag[]): EffectQuery => {
  const words = filter.trim().split(/\s+/).filter((word) => word.length > 0);
  let channel: string | null = null;
  const rest: string[] = [];

  for (const word of words) {
    const port = ports.find(({ tag }) => word.toLowerCase() === tag);
    if (port !== undefined) channel = port.channel;
    else rest.push(word);
  }

  return { channel, text: rest.join(' ') };
};

export { parseEffectQuery };
