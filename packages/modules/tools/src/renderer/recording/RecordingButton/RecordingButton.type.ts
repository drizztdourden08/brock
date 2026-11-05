/* @layer renderer-shell @kind types */
import type { RecordingOutcome } from '../../../recording.type';

interface RecordingSamplerOptions {
  scope: string;
  captureFrame: () => Promise<Blob | null>;
  sample?: () => unknown;
  intervalMs?: number;
  maxMs?: number;
  maxFrames?: number;
  onFinished?: (key: string, outcome: RecordingOutcome | null) => void;
}

interface RecordingSamplerResult {
  isCapturing: boolean;
  startedAt: number | null;
  start: () => void;
  stop: () => void;
}

interface RecordingCaptureResult extends RecordingSamplerResult {
  handleClick: () => Promise<void>;
  showFfmpegPrompt: boolean;
  resolveFfmpegPrompt: () => void;
}

interface RecordingButtonProps extends RecordingSamplerOptions {
  startLabel?: string;
  stopLabel?: string;
}

export type { RecordingButtonProps, RecordingCaptureResult, RecordingSamplerOptions, RecordingSamplerResult };
