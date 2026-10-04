/* @layer electron-main @kind logic */
import { END_SIGNATURE, END_SIZE } from './zip.constants';

const endRecord = (count: number, size: number, offset: number): Buffer => {
  const end = Buffer.alloc(END_SIZE);
  end.writeUInt32LE(END_SIGNATURE, 0);
  end.writeUInt16LE(count, 8);
  end.writeUInt16LE(count, 10);
  end.writeUInt32LE(size, 12);
  end.writeUInt32LE(offset, 16);
  return end;
};

export { endRecord };
