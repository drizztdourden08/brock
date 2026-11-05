/* @layer renderer-shell @kind types */
import type { RandomizerOptions } from '../../../randomizer-options.type';

interface OptionsPanelProps {
  title: string;
  overrides: RandomizerOptions;
  seed?: string;
  tab?: string;
  onTabChange?(tab: string): void;
  onChange?(next: RandomizerOptions): void;
}

export type { OptionsPanelProps };
