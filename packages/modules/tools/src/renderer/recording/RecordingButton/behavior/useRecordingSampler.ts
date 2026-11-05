/* @layer renderer-shell @kind hook */
import { useCallback, useRef, useState } from 'react';
import type { RecordingFrame } from '../../../../recording.type';
import { toolsApi } from '../../../tools-api';
import { DEFAULT_INTERVAL_MS, DEFAULT_MAX_FRAMES, DEFAULT_MAX_MS } from '../RecordingButton.constants';
import type { RecordingSamplerOptions, RecordingSamplerResult } from '../RecordingButton.type';

const useRecordingSampler = (options: RecordingSamplerOptions): RecordingSamplerResult => {
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const run = useRef({ gen: 0, key: '', frames: [] as RecordingFrame[], samples: [] as unknown[] });

  const stop = useCallback(() => {
    const { gen, key, frames, samples } = run.current;
    run.current.gen = gen + 1;
    setStartedAt(null);
    const { scope, onFinished } = optionsRef.current;
    if (frames.length === 0) return;
    void toolsApi()?.finalizeRecording({ scope, key, frames, samples })
      .then((result) => onFinished?.(key, result.success ? result.value : null));
  }, []);

  const tick = useCallback(async (gen: number, began: number): Promise<void> => {
    const { captureFrame, sample, intervalMs = DEFAULT_INTERVAL_MS, maxMs = DEFAULT_MAX_MS, maxFrames = DEFAULT_MAX_FRAMES } = optionsRef.current;
    const blob = await captureFrame();
    if (gen !== run.current.gen) return;
    const capturedAt = Date.now();
    if (blob) {
      run.current.frames.push({ capturedAt, png: await blob.arrayBuffer() });
      if (sample) run.current.samples.push(sample());
    }
    if (run.current.frames.length >= maxFrames || capturedAt - began >= maxMs) { stop(); return; }
    setTimeout(() => { void tick(gen, began); }, intervalMs);
  }, [stop]);

  const start = useCallback(() => {
    const began = Date.now();
    run.current = { gen: run.current.gen + 1, key: `session-${began}`, frames: [], samples: [] };
    setStartedAt(began);
    void tick(run.current.gen, began);
  }, [tick]);

  return { isCapturing: startedAt !== null, startedAt, start, stop };
};

export { useRecordingSampler };
