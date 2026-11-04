/* @layer core @kind types */
interface RatioLimits {
  min: number;
  max: number;
}

interface RatioCheck {
  valid: boolean;
  ratio: number;
  error?: string;
}

interface RatioReadout {
  detected: number;
  used: number;
  capped: boolean;
}

interface RatioPair {
  w: number;
  h: number;
}

interface LandscapePair {
  long: number;
  short: number;
}

interface CustomRatioInput {
  customW: number;
  customH: number;
  limits: RatioLimits;
  letterbox?: boolean;
}

export type { RatioLimits, RatioCheck, RatioReadout, RatioPair, LandscapePair, CustomRatioInput };
