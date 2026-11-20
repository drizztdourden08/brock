/* @layer electron-main @kind logic */
import { nativeImage } from 'electron';
import type { ClipboardBackend, ClipboardBundle, ClipboardImage } from './clipboard-backend.type';
import type { LegacyClipboard } from './electron-clipboard.type';
import { IMAGE_EVERY, SAMPLE_PIXELS } from './fingerprint.constants';
import { pngImageOf } from './png-image-of';
import { sampleBytes } from './sample-bytes';

const settle = <T>(read: () => T): Promise<T> =>
  new Promise((resolve) => {
    resolve(read());
  });

const legacyClipboard = (board: LegacyClipboard, ownPrefix: string): ClipboardBackend => {
  let polls = 0;
  let decoded = '';
  let seenFormats = '';

  const bufferOf = (type: string): Uint8Array => {
    try {
      return board.readBuffer(type);
    } catch {
      return new Uint8Array(0);
    }
  };

  const hasImage = (): boolean => board.availableFormats().some((format) => format.startsWith('image/'));

  const decodedImage = (): ClipboardImage | null => {
    if (!hasImage()) return null;
    const image = board.readImage();
    if (image.isEmpty()) return null;
    const { width, height } = image.getSize();
    return { width, height, png: () => image.toPNG() };
  };

  const decodedPart = (): string => {
    const image = board.readImage();
    const { width, height } = image.getSize();
    const pixels = width * height <= SAMPLE_PIXELS ? sampleBytes(image.toBitmap()) : 'large';
    return `${width}x${height}:${pixels}`;
  };

  const imageSignal = (names: string): string => {
    if (!hasImage()) return '';
    const raw = bufferOf('image/png');
    if (raw.length > 0) return sampleBytes(raw);
    if (names !== seenFormats || polls % IMAGE_EVERY === 0) decoded = decodedPart();
    return decoded;
  };

  const write = ({ text, png, privates }: ClipboardBundle): void => {
    if (text === undefined && png === undefined) board.clear();
    else board.write({ ...(text === undefined ? {} : { text }), ...(png === undefined ? {} : { image: nativeImage.createFromBuffer(Buffer.from(png)) }) });
    for (const item of privates) board.writeBuffer(item.type, Buffer.from(item.data));
  };

  const fingerprint = (): string => {
    const formats = board.availableFormats();
    const names = formats.join('|');
    polls += 1;
    const image = imageSignal(names);
    seenFormats = names;
    const own = formats.filter((format) => format.startsWith(ownPrefix)).map((format) => sampleBytes(bufferOf(format)));
    return [names, sampleBytes(Buffer.from(board.readText())), image, ...own].join('#');
  };

  return {
    readText: () => settle(() => board.readText()),
    readBuffer: (type) => settle(() => bufferOf(type)),
    readImage: () => settle(() => pngImageOf(bufferOf('image/png')) ?? decodedImage()),
    write: (bundle) => settle(() => write(bundle)),
    fingerprint: () => settle(fingerprint),
  };
};

export { legacyClipboard };
