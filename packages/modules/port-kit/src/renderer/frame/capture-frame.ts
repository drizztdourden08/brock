/* @layer renderer-shell @kind logic */
const captureFrame = (canvas: HTMLCanvasElement): Promise<Blob | null> => {
  if (!canvas.width || !canvas.height) return Promise.resolve(null);
  const copy = document.createElement('canvas');
  copy.width = canvas.width;
  copy.height = canvas.height;
  const context = copy.getContext('2d');
  if (!context) return Promise.resolve(null);
  context.drawImage(canvas, 0, 0);
  return new Promise((resolve) => copy.toBlob(resolve, 'image/png'));
};

export { captureFrame };
