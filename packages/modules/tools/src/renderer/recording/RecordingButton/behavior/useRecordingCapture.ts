/* @layer renderer-shell @kind hook */
import { useCallback, useState } from 'react';
import { FFMPEG_TOOL_ID } from '../../../../recording.constants';
import { toolsApi } from '../../../tools-api';
import type { RecordingCaptureResult, RecordingSamplerOptions } from '../RecordingButton.type';
import { useRecordingSampler } from './useRecordingSampler';

const useRecordingCapture = (options: RecordingSamplerOptions): RecordingCaptureResult => {
  const sampler = useRecordingSampler(options);
  const { isCapturing, start, stop } = sampler;
  const [showFfmpegPrompt, setShowFfmpegPrompt] = useState(false);

  const handleClick = useCallback(async () => {
    if (isCapturing) {
      stop();
      return;
    }
    const ffmpeg = await toolsApi()?.state(FFMPEG_TOOL_ID).catch(() => null);
    if (ffmpeg?.status === 'ready') start();
    else setShowFfmpegPrompt(true);
  }, [isCapturing, start, stop]);

  const resolveFfmpegPrompt = useCallback(() => {
    setShowFfmpegPrompt(false);
    start();
  }, [start]);

  return { ...sampler, handleClick, showFfmpegPrompt, resolveFfmpegPrompt };
};

export { useRecordingCapture };
