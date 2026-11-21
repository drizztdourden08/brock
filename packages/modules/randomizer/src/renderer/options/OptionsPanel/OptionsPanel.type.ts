/* @layer renderer-shell @kind types */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { RandomizerModeId } from '../../../augment';
import type { RandomizerOptions } from '../../../randomizer-options.type';

interface OptionsPanelProps {
  title: Text;
  overrides: RandomizerOptions;
  seed?: string;
  mode: RandomizerModeId;
  romFile: string | null;
  tab?: string;
  onTabChange?(tab: string): void;
  onChange?(next: RandomizerOptions): void;
}

export type { OptionsPanelProps };
