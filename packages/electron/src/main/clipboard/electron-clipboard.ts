/* @layer electron-main @kind logic */
import { createHash } from 'crypto';
import { clipboard, nativeImage } from 'electron';
import type { ClipboardBackend, ClipboardImage } from './clipboard-backend.type';
import { IMAGE_EVERY, SAMPLE_BYTES, SAMPLE_PIXELS } from './fingerprint.constants';
import { pngSize } from './png-size';

const sample = (bytes: Uint8Array): string => `${bytes.length}:${createHash('sha1').update(bytes.subarray(0, SAMPLE_BYTES)).digest('hex')}`;

const bufferOf = (type: string): Uint8Array => {
  try {
    return clipboard.readBuffer(type);
  } catch {
    return new Uint8Array(0);
  }
};

const hasImage = (): boolean => clipboard.availableFormats().some((format) => format.startsWith('image/'));

const rawPng = (): ClipboardImage | null => {
  const raw = bufferOf('image/png');
  if (raw.length === 0) return null;
  const size = pngSize(raw);
  if (size === null) throw new Error('The clipboard image is not a whole PNG within the size limits');
  return { ...size, png: () => raw };
};

const decodedImage = (): ClipboardImage | null => {
  if (!hasImage()) return null;
  const image = clipboard.readImage();
  if (image.isEmpty()) return null;
  const { width, height } = image.getSize();
  return { width, height, png: () => image.toPNG() };
};

const decodedPart = (): string => {
  const image = clipboard.readImage();
  const { width, height } = image.getSize();
  const pixels = width * height <= SAMPLE_PIXELS ? sample(image.toBitmap()) : 'large';
  return `${width}x${height}:${pixels}`;
};

const electronClipboard = (ownPrefix: string): ClipboardBackend => {
  let polls = 0;
  let decoded = '';
  let seenFormats = '';

  const imageSignal = (names: string): string => {
    if (!hasImage()) return '';
    const raw = bufferOf('image/png');
    if (raw.length > 0) return sample(raw);
    if (names !== seenFormats || polls % IMAGE_EVERY === 0) decoded = decodedPart();
    return decoded;
  };

  return {
    readText: () => clipboard.readText(),
    readBuffer: bufferOf,
    readImage: () => rawPng() ?? decodedImage(),
    write: ({ text, png, privates }) => {
      if (text === undefined && png === undefined) clipboard.clear();
      else clipboard.write({ ...(text === undefined ? {} : { text }), ...(png === undefined ? {} : { image: nativeImage.createFromBuffer(Buffer.from(png)) }) });
      for (const item of privates) clipboard.writeBuffer(item.type, Buffer.from(item.data));
    },
    fingerprint: () => {
      const formats = clipboard.availableFormats();
      const names = formats.join('|');
      polls += 1;
      const image = imageSignal(names);
      seenFormats = names;
      const own = formats.filter((format) => format.startsWith(ownPrefix)).map((format) => sample(bufferOf(format)));
      return [names, sample(Buffer.from(clipboard.readText())), image, ...own].join('#');
    },
  };
};

export { electronClipboard };
