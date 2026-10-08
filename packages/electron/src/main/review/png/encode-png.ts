/* @layer electron-main @kind logic */
import { crc32, deflateSync } from 'zlib';
import type { ReviewBitmap } from '@drizztdourden08/brock-core/review';
import { BIT_DEPTH, COLOR_RGBA, FILTER_NONE, HEADER_LENGTH, PNG_SIGNATURE, RGBA } from './png.constants';

const chunk = (type: string, data: Uint8Array): Buffer => {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'latin1'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([length, body, crc]);
};

const headerOf = ({ width, height }: ReviewBitmap): Buffer => {
  const header = Buffer.alloc(HEADER_LENGTH);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header.set([BIT_DEPTH, COLOR_RGBA, 0, 0, 0], 8);
  return header;
};

const encodePng = (bitmap: ReviewBitmap): Buffer => {
  const stride = bitmap.width * RGBA;
  const raw = Buffer.alloc((stride + 1) * bitmap.height);
  for (let y = 0; y < bitmap.height; y += 1) {
    raw[y * (stride + 1)] = FILTER_NONE;
    raw.set(bitmap.data.subarray(y * stride, (y + 1) * stride), y * (stride + 1) + 1);
  }
  return Buffer.concat([PNG_SIGNATURE, chunk('IHDR', headerOf(bitmap)), chunk('IDAT', deflateSync(raw)), chunk('IEND', new Uint8Array(0))]);
};

export { encodePng };
