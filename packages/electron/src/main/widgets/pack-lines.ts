/* @layer electron-main @kind logic */
import type { PackSpan, Span } from './widget-windows.type';

const at = (place: readonly number[], index: number): number => place[index] ?? 0;

const pushForward = (place: number[], spans: readonly PackSpan[]): void => {
  for (let line = 1; line < place.length; line += 1) {
    const ending = spans.filter((span) => span.to === line).map((span) => at(place, span.from) + span.min);
    place[line] = Math.max(at(place, line), at(place, line - 1), ...ending);
  }
};

const pullBack = (place: number[], spans: readonly PackSpan[], end: number): void => {
  const last = place.length - 1;
  place[last] = Math.min(at(place, last), end);
  for (let line = last - 1; line >= 0; line -= 1) {
    const starting = spans.filter((span) => span.from === line).map((span) => at(place, span.to) - span.min);
    place[line] = Math.min(at(place, line), at(place, line + 1), ...starting);
  }
};

const settle = (place: readonly number[], span: PackSpan, area: Span): Span => {
  const start = Math.max(at(place, span.from), area.start);
  const length = Math.max(at(place, span.to) - start, span.min);
  return { start: Math.max(Math.min(start, area.start + area.length - length), area.start), length };
};

const packLines = (wanted: readonly Span[], mins: readonly number[], area: Span): Span[] => {
  const lines = [...new Set(wanted.flatMap((span) => [span.start, span.start + span.length]))].sort((a, b) => a - b);
  const spans = wanted.map((span, index) => ({
    from: lines.indexOf(span.start), to: lines.indexOf(span.start + span.length), min: Math.min(mins[index] ?? 0, area.length),
  }));
  const place = lines.map((line) => Math.min(Math.max(line, area.start), area.start + area.length));
  pushForward(place, spans);
  pullBack(place, spans, area.start + area.length);
  return spans.map((span) => settle(place, span, area));
};

export { packLines };
