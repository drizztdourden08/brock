/* @layer renderer-shell @kind types */
import type { RumblePreset } from '../DeviceCard.type';

interface RumbleActionsProps {
  error: string | null;
  onRumble: (preset: RumblePreset) => void;
}

export type { RumbleActionsProps };
