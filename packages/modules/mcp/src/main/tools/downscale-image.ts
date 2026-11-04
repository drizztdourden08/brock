/* @layer electron-main @kind logic */
import { nativeImage } from 'electron';

const downscaleImage = (png: Buffer, maxWidth: number): { png: Buffer; width: number; height: number } => {
  const image = nativeImage.createFromBuffer(png);
  const size = image.getSize();
  if (size.width <= maxWidth) return { png, ...size };
  const resized = image.resize({ width: maxWidth, quality: 'best' });
  return { png: resized.toPNG(), ...resized.getSize() };
};

export { downscaleImage };
