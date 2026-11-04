/* @layer renderer-shell @kind types */
import type { SegmentOption } from '@drizztdourden08/tessera/primitives';
import type { RatioCheck, RatioLimits } from '../../aspect-ratio/index';
import type { PRESET_GROUP_IDS } from './AspectRatioControl.constants';

interface AspectRatioChange {
  value: string;
  customW?: number;
  customH?: number;
}

interface AspectRatioControlProps {
  label: string;
  description?: string;
  value: string;
  options: SegmentOption[];
  presetOptions?: SegmentOption[];
  widePresets?: SegmentOption[];
  tallPresets?: SegmentOption[];
  descriptions?: Record<string, string>;
  recommendedValue?: string;
  recommendedNote?: string;
  customW: number;
  customH: number;
  limits: RatioLimits;
  letterbox?: boolean;
  onChange: (change: AspectRatioChange) => void;
}

type PresetGroupId = (typeof PRESET_GROUP_IDS)[number];

type PresetGroups = Readonly<Record<PresetGroupId, SegmentOption[] | undefined>>;

interface RatioChangeParams {
  value: string;
  groups: PresetGroups;
  customW: number;
  customH: number;
  limits: RatioLimits;
  letterbox: boolean;
}

interface RatioPairParams {
  customW: number;
  customH: number;
  limits: RatioLimits;
  letterbox: boolean;
  onChange: (change: AspectRatioChange) => void;
}

interface RatioPairFieldsProps {
  w: number;
  h: number;
  check: RatioCheck;
  onWidth: (n: number) => void;
  onHeight: (n: number) => void;
}

interface RatioDetectedProps {
  detected: number;
  used: number;
  capped: boolean;
}

export type {
  AspectRatioChange, AspectRatioControlProps, PresetGroupId, PresetGroups, RatioChangeParams, RatioPairParams,
  RatioPairFieldsProps, RatioDetectedProps,
};
