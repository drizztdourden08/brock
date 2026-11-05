/* @layer renderer-shell @kind types */
import type { ToolState } from '../../../tools.type';

interface FfmpegInstallStepProps {
  state: ToolState | null;
  installing: boolean;
  error: string | null;
  onInstall: () => void;
}

export type { FfmpegInstallStepProps };
