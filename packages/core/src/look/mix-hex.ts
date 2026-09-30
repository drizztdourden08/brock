/* @layer core @kind logic */
import { HEX_PAIR } from './look.constants';

const channelsOf = (hex: string): number[] => {
  const match = HEX_PAIR.exec(hex);
  if (!match) throw new Error(`"${hex}" is not a colour like "#3b6fe0"`);
  return match.slice(1).map((pair) => parseInt(pair, 16));
};

const toHex = (value: number): string => Math.round(value).toString(16).padStart(2, '0');

const mixHex = (a: string, b: string, shareOfA: number): string => {
  const left = channelsOf(a);
  const right = channelsOf(b);
  return `#${left.map((channel, i) => toHex(channel * shareOfA + (right[i] ?? 0) * (1 - shareOfA))).join('')}`;
};

export { mixHex };
