/* @layer renderer-shell @kind types */
import type { MsuPackManifest } from '../../types';

interface SoundGroupFieldProps {
  pack: string;
  channel: string;
  soundId: number;
  group: string | undefined;
  saveBase: MsuPackManifest;
  disabled?: boolean;
  onSaved: () => void;
}

export type { SoundGroupFieldProps };
