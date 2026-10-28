/* @layer electron-main @kind logic */
import { createHash } from 'crypto';
import { clipboard, nativeImage } from 'electron';
import type { ClipboardBackend } from './clipboard-backend.type';
import { SAMPLE_BYTES, SAMPLE_PIXELS } from './fingerprint.constants';

const sample = (bytes: Uint8Array): string => `${bytes.length}:${createHash('sha1').update(bytes.subarray(0, SAMPLE_BYTES)).digest('hex')}`;

const electronClipboard = (ownPrefix: string): ClipboardBackend => {
  const imageNow = (): Electron.NativeImage | null => {
    if (!clipboard.availableFormats().some((format) => format.startsWith('image/'))) return null;
    const image = clipboard.readImage();
    return image.isEmpty() ? null : image;
  };

  return {
    readText: () => clipboard.readText(),
    readBuffer: (type) => {
      try {
        return clipboard.readBuffer(type);
      } catch {
        return new Uint8Array(0);
      }
    },
    readImage: () => {
      const image = imageNow();
      if (image === null) return null;
      const { width, height } = image.getSize();
      return { width, height, png: () => image.toPNG() };
    },
    write: ({ text, png, privates }) => {
      if (text === undefined && png === undefined) clipboard.clear();
      else clipboard.write({ ...(text === undefined ? {} : { text }), ...(png === undefined ? {} : { image: nativeImage.createFromBuffer(Buffer.from(png)) }) });
      for (const item of privates) clipboard.writeBuffer(item.type, Buffer.from(item.data));
    },
    fingerprint: () => {
      const formats = clipboard.availableFormats();
      const parts = [formats.join('|'), sample(Buffer.from(clipboard.readText()))];
      const image = formats.some((format) => format.startsWith('image/')) ? clipboard.readImage() : null;
      if (image !== null && !image.isEmpty()) {
        const { width, height } = image.getSize();
        parts.push(`${width}x${height}`, width * height <= SAMPLE_PIXELS ? sample(image.toBitmap()) : 'large');
      }
      for (const format of formats) if (format.startsWith(ownPrefix)) parts.push(sample(clipboard.readBuffer(format)));
      return parts.join('#');
    },
  };
};

export { electronClipboard };
