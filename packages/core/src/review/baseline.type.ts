/* @layer core @kind types */
type BaselineMode = 'compare' | 'bless';

type BaselineStatus = 'match' | 'differs' | 'size' | 'missing' | 'unused' | 'blessed';

interface ReviewBitmap {
  width: number;
  height: number;
  data: Uint8Array;
}

interface MaskRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface SelectorMask {
  selector: string;
}

type BaselineMask = MaskRect | SelectorMask;

interface BaselineRule {
  tolerance?: number;
  masks?: BaselineMask[];
}

interface BaselineConfig {
  tolerance: number;
  masks: BaselineMask[];
  captures: Record<string, BaselineRule>;
}

interface ResolvedRule {
  tolerance: number;
  rects: MaskRect[];
  selectors: string[];
}

interface BitmapDiff {
  diffPixels: number;
  comparedPixels: number;
  ratio: number;
  diff: ReviewBitmap;
}

interface BaselineResult {
  capture: string;
  step: string;
  file: string;
  status: BaselineStatus;
  diffPixels: number;
  ratio: number;
  tolerance: number;
  masked: number;
  diff?: string;
  detail?: string;
}

interface BaselineReport {
  mode: BaselineMode;
  platform: string;
  dir: string;
  results: BaselineResult[];
}

export type {
  BaselineConfig, BaselineMask, BaselineMode, BaselineReport, BaselineResult, BaselineRule, BaselineStatus, BitmapDiff, MaskRect,
  ResolvedRule, ReviewBitmap, SelectorMask,
};
