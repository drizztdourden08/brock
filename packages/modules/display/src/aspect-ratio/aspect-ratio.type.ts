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
  portrait: boolean;
}

interface RatioValueInput {
  customW: number;
  customH: number;
  limits: RatioLimits;
  letterbox?: boolean;
  keepOrientation?: boolean;
}

export type { RatioLimits, RatioCheck, RatioReadout, RatioPair, LandscapePair, RatioValueInput };
