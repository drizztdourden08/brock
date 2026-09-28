/* @layer renderer-shell @kind logic */
import type { FramePresenter, FrameSize } from './frame.type';
import { captureFrame } from './capture-frame';

const createFramePresenter = (canvas: HTMLCanvasElement, size: FrameSize | null): FramePresenter => {
  if (!size) return { present: () => undefined, capture: () => captureFrame(canvas) };
  canvas.width = size.width;
  canvas.height = size.height;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('The game canvas has no 2D context.');
  const image = context.createImageData(size.width, size.height);

  const present = (rgba: Uint8Array): void => {
    image.data.set(rgba.subarray(0, image.data.length));
    context.putImageData(image, 0, 0);
  };

  return { present, capture: () => captureFrame(canvas) };
};

export { createFramePresenter };
