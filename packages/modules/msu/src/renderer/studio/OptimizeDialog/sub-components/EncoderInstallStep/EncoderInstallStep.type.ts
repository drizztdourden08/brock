/* @layer renderer-shell @kind types */
import type { ToolState } from '@drizztdourden08/brock-tools/renderer';

interface EncoderInstallStepProps {
  state: ToolState | null;
  installing: boolean;
  error: string | null;
  onInstall: () => void;
}

export type { EncoderInstallStepProps };
