/* @layer renderer-shell @kind logic */
import { abortable } from '../abortable';
import { FIRST_FRAME_TASK } from '../boot.constants';
import { firstFrameSignal } from '../first-frame-signal';
import type { RendererBootTask } from '../renderer-boot.type';
import { useBootStore } from '../useBootStore';
import { waitFrames } from '../wait-frames';

const firstFrameTask = (after: string[]): RendererBootTask => ({
  id: FIRST_FRAME_TASK,
  label: 'Drawing the first frame',
  after,
  run: async ({ signal }) => {
    useBootStore.getState().setPhase('painting');
    await abortable(firstFrameSignal.promise, signal);
    await abortable(document.fonts.ready, signal);
    await waitFrames(1);
  },
});

export { firstFrameTask };
