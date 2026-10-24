/* @layer tooling-scripts @kind logic */
import { gzipSync } from 'node:zlib';
import { MODE_DIRECTORY, TAR_BLOCK, TAR_MTIME, TAR_NAME_LENGTH, TAR_PREFIX_LENGTH } from './server-packaging.constants.mjs';

const octal = (value, width) => `${value.toString(8).padStart(width - 1, '0')}\0`;

const splitName = (name) => {
  if (Buffer.byteLength(name) <= TAR_NAME_LENGTH) return { prefix: '', base: name };
  const cut = name.lastIndexOf('/', name.length - 2);
  const prefix = name.slice(0, cut);
  const base = name.slice(cut + 1);
  if (cut < 1 || Buffer.byteLength(prefix) > TAR_PREFIX_LENGTH || Buffer.byteLength(base) > TAR_NAME_LENGTH) throw new Error(`tar: the path "${name}" is too long.`);
  return { prefix, base };
};

const header = ({ name, mode, size, type }) => {
  const block = Buffer.alloc(TAR_BLOCK);
  const { prefix, base } = splitName(name);
  const fields = [
    [base, 0], [octal(mode, 8), 100], [octal(0, 8), 108], [octal(0, 8), 116], [octal(size, 12), 124], [octal(TAR_MTIME, 12), 136],
    ['        ', 148], [type, 156], ['ustar\0', 257], ['00', 263], ['root', 265], ['root', 297], [prefix, 345],
  ];
  for (const [text, at] of fields) block.write(text, at, 'utf8');
  const sum = block.reduce((total, byte) => total + byte, 0);
  block.write(`${sum.toString(8).padStart(6, '0')}\0 `, 148, 'latin1');
  return block;
};

const directoriesOf = (entries) => {
  const dirs = new Set();
  for (const { path } of entries) {
    const parts = path.split('/').slice(0, -1);
    parts.forEach((_, at) => dirs.add(`${parts.slice(0, at + 1).join('/')}/`));
  }
  return [...dirs].sort();
};

const padding = (size) => Buffer.alloc((TAR_BLOCK - (size % TAR_BLOCK)) % TAR_BLOCK);

/**
 * @param {{ path: string, mode: number, data: Buffer | string }[]} entries files, paths relative to the archive root
 * @returns {Buffer} a gzip ustar archive, root-owned, fixed time
 */
const tarGz = (entries) => {
  const dirs = directoriesOf(entries).map((name) => header({ name, mode: MODE_DIRECTORY, size: 0, type: '5' }));
  const files = [...entries].sort((a, b) => a.path.localeCompare(b.path)).flatMap(({ path, mode, data }) => {
    const bytes = Buffer.from(data);
    return [header({ name: path, mode, size: bytes.length, type: '0' }), bytes, padding(bytes.length)];
  });
  return gzipSync(Buffer.concat([...dirs, ...files, Buffer.alloc(TAR_BLOCK * 2)]), { level: 9 });
};

export { tarGz };
