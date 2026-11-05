/* @layer renderer-shell @kind types */
import type { RandomizerOptions } from '../../../randomizer-options.type';

interface OptionsPanelProps {
  title: string;
  overrides: RandomizerOptions;
  seed?: string;
  onChange?(next: RandomizerOptions): void;
}

export type { OptionsPanelProps };
