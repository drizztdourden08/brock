/* @layer electron-main @kind constants */
const PNG_SIGNATURE = Uint8Array.from([137, 80, 78, 71, 13, 10, 26, 10]);
const CHUNK_HEADER = 8;
const CHUNK_CRC = 4;
const HEADER_LENGTH = 13;
const BIT_DEPTH = 8;
const COLOR_RGB = 2;
const COLOR_RGBA = 6;
const CHANNELS: Readonly<Record<number, number>> = { [COLOR_RGB]: 3, [COLOR_RGBA]: 4 };
const RGBA = 4;
const OPAQUE = 255;
const FILTER_NONE = 0;
const FILTER_SUB = 1;
const FILTER_UP = 2;
const FILTER_AVERAGE = 3;
const FILTER_PAETH = 4;

export {
  BIT_DEPTH, CHANNELS, CHUNK_CRC, CHUNK_HEADER, COLOR_RGBA, FILTER_AVERAGE, FILTER_NONE, FILTER_PAETH, FILTER_SUB, FILTER_UP,
  HEADER_LENGTH, OPAQUE, PNG_SIGNATURE, RGBA,
};
