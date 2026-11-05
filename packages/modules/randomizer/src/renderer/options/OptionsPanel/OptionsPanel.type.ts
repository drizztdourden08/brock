/* @layer renderer-shell @kind types */
import type { RandomizerModeId } from '../../../augment';
import type { RandomizerOptions } from '../../../randomizer-options.type';

interface OptionsPanelProps {
  title: string;
  overrides: RandomizerOptions;
  seed?: string;
  mode: RandomizerModeId;
  romFile: string | null;
  tab?: string;
  onTabChange?(tab: string): void;
  onChange?(next: RandomizerOptions): void;
}

export type { OptionsPanelProps };
