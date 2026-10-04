/* @layer electron-main @kind logic */
import type { Span } from './widget-windows.type';

const spansNear = (a: Span, b: Span, reach: number): boolean => a.start <= b.start + b.length + reach && b.start <= a.start + a.length + reach;

export { spansNear };
