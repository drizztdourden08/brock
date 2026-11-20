/* @layer electron-main @kind logic */
import { CLIPBOARD_PNG, CLIPBOARD_TEXT } from '@drizztdourden08/brock-core/platform';
import type { ClipboardBackend, ClipboardBundle } from './clipboard-backend.type';
import type { AsyncClipboard, AsyncClipboardItem, ClipboardItemCtor } from './electron-clipboard.type';
import { IMAGE_EVERY } from './fingerprint.constants';
import { pngImageOf } from './png-image-of';
import { sampleBytes } from './sample-bytes';

const bytesIn = async (items: AsyncClipboardItem[], type: string): Promise<Uint8Array> => {
  const item = items.find((entry) => entry.types.includes(type));
  if (item === undefined) return new Uint8Array(0);
  try {
    const blob = await item.getType(type);
    return new Uint8Array(await blob.arrayBuffer());
  } catch {
    return new Uint8Array(0);
  }
};

const blobOf = (data: Uint8Array, type: string): Blob => new Blob([Uint8Array.from(data)], { type });

const entriesOf = ({ text, png, privates }: ClipboardBundle): Record<string, Blob | string> => ({
  ...(text === undefined ? {} : { [CLIPBOARD_TEXT]: text }),
  ...(png === undefined ? {} : { [CLIPBOARD_PNG]: blobOf(png, CLIPBOARD_PNG) }),
  ...Object.fromEntries(privates.map((item) => [item.type, blobOf(item.data, item.type)])),
});

const asyncClipboard = (board: AsyncClipboard, Item: ClipboardItemCtor, ownPrefix: string): ClipboardBackend => {
  let polls = 0;
  let image = '';
  let seenFormats = '';

  const readType = async (type: string): Promise<Uint8Array> => {
    try {
      return await bytesIn(await board.read(), type);
    } catch {
      return new Uint8Array(0);
    }
  };

  const imageSignal = async (items: AsyncClipboardItem[], formats: string[], names: string): Promise<string> => {
    if (!formats.includes(CLIPBOARD_PNG)) return '';
    if (image === '' || names !== seenFormats || polls % IMAGE_EVERY === 0) image = sampleBytes(await bytesIn(items, CLIPBOARD_PNG));
    return image;
  };

  const write = async (bundle: ClipboardBundle): Promise<void> => {
    const entries = entriesOf(bundle);
    if (Object.keys(entries).length === 0) board.clear();
    else await board.write([new Item(entries)]);
  };

  const fingerprint = async (): Promise<string> => {
    const items = await board.read();
    const formats = [...new Set(items.flatMap((item) => item.types))];
    const names = formats.join('|');
    polls += 1;
    const picture = await imageSignal(items, formats, names);
    seenFormats = names;
    const own = await Promise.all(formats.filter((format) => format.startsWith(ownPrefix)).map(async (format) => sampleBytes(await bytesIn(items, format))));
    return [names, sampleBytes(Buffer.from(await board.readText())), picture, ...own].join('#');
  };

  return {
    readText: () => board.readText(),
    readBuffer: readType,
    readImage: async () => pngImageOf(await readType(CLIPBOARD_PNG)),
    write,
    fingerprint,
  };
};

export { asyncClipboard };
