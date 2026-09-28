/* @layer electron-main @kind types */
interface XrandrState {
  output: string;
  resolution: string;
  rates: number[];
  currentRate: number | null;
}

interface ParsedRates {
  rates: number[];
  current: number | null;
}

export type { XrandrState, ParsedRates };
