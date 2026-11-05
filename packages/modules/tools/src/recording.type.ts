/* @layer core @kind types */
interface RecordingFrame {
  capturedAt: number;
  png: ArrayBuffer;
}

interface RecordingFinalizeInput {
  scope: string;
  key: string;
  frames: RecordingFrame[];
  samples?: unknown[];
}

interface RecordingOutcome {
  dir: string;
  frameCount: number;
  video: boolean;
}

interface RecordingSentRef {
  scope: string;
  keys: string[];
}

type RecordingManifest = Record<string, { sentAt: number | null }>;

export type { RecordingFinalizeInput, RecordingFrame, RecordingManifest, RecordingOutcome, RecordingSentRef };
