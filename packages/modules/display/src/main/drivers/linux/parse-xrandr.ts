/* @layer electron-main @kind logic */
import { CONNECTED_LINE, MODE_LINE } from './linux.constants';
import type { ParsedRates, XrandrState } from './linux.type';

const parseRates = (list: string): ParsedRates => {
  const rates: number[] = [];
  let current: number | null = null;
  for (const token of list.trim().split(/\s+/)) {
    const hz = Number.parseFloat(token.replace(/[*+]/g, ''));
    if (!Number.isFinite(hz) || hz <= 0) continue;
    rates.push(Math.round(hz));
    if (token.includes('*')) current = Math.round(hz);
  }
  return { rates, current };
};

const activeBlock = (lines: string[]): { output: string; resolution: string; body: string[] } | null => {
  const start = lines.findIndex((line) => CONNECTED_LINE.test(line));
  const header = start < 0 ? null : CONNECTED_LINE.exec(lines[start] ?? '');
  const [, output, resolution] = header ?? [];
  if (!output || !resolution) return null;
  const rest = lines.slice(start + 1);
  const end = rest.findIndex((line) => /^\S/.test(line));
  return { output, resolution, body: end < 0 ? rest : rest.slice(0, end) };
};

const parseXrandr = (out: string): XrandrState | null => {
  const block = activeBlock(out.split('\n'));
  if (!block) return null;
  const rates = new Set<number>();
  let currentRate: number | null = null;
  for (const line of block.body) {
    const [, resolution, list] = MODE_LINE.exec(line) ?? [];
    if (resolution !== block.resolution || list === undefined) continue;
    const parsed = parseRates(list);
    for (const hz of parsed.rates) rates.add(hz);
    currentRate = parsed.current ?? currentRate;
  }
  return { output: block.output, resolution: block.resolution, rates: [...rates].sort((a, b) => a - b), currentRate };
};

export { parseXrandr };
