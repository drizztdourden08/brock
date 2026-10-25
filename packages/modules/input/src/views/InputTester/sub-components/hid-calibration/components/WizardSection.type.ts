/* @layer renderer-shell @kind types */
import type { useHidCalibration } from '../hooks';

interface WizardSectionProps {
  wiz: ReturnType<typeof useHidCalibration>;
}

export type { WizardSectionProps };
