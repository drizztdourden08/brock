/* @layer core @kind logic */
import { HEX_PAIR } from './look.constants';

const linear = (channel: number): number => {
  const value = channel / 255;
  return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
};

const luminance = (hex: string): number => {
  const match = HEX_PAIR.exec(hex);
  if (!match) throw new Error(`"${hex}" is not a colour like "#3b6fe0"`);
  const [r = 0, g = 0, b = 0] = match.slice(1).map((pair) => linear(parseInt(pair, 16)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const contrastRatio = (a: string, b: string): number => {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return ((light ?? 0) + 0.05) / ((dark ?? 0) + 0.05);
};

export { contrastRatio };
