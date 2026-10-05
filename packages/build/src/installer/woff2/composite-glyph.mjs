/* @layer tooling-scripts @kind logic */
import {
  ARG_WORDS, COMPOSITE_CONTOURS, HAS_INSTRUCTIONS, HAS_SCALE, HAS_TWO_BY_TWO, HAS_XY_SCALE, MORE_COMPONENTS,
} from './woff2.constants.mjs';

/**
 * @param {number} flags
 * @returns {number}  the bytes after a component's flags and glyph index
 */
const componentTail = (flags) => {
  const args = flags & ARG_WORDS ? 4 : 2;
  if (flags & HAS_SCALE) return args + 2;
  if (flags & HAS_XY_SCALE) return args + 4;
  return flags & HAS_TWO_BY_TWO ? args + 8 : args;
};

/**
 * @param {import('./byte-reader.mjs').ByteReader} composite
 * @returns {{ parts: Buffer[], instructed: boolean }}  the components as stored
 */
const readComponents = (composite) => {
  const parts = [];
  let flags = MORE_COMPONENTS;
  let instructed = false;
  while (flags & MORE_COMPONENTS) {
    const head = composite.bytes(4);
    flags = head.readUInt16BE(0);
    instructed ||= Boolean(flags & HAS_INSTRUCTIONS);
    parts.push(head, composite.bytes(componentTail(flags)));
  }
  return { parts, instructed };
};

/**
 * @param {import('./glyf-streams.mjs').GlyfStreams['streams']} streams
 * @returns {Buffer}  the composite glyph in TrueType form, box as stored
 */
const compositeGlyph = (streams) => {
  const head = Buffer.alloc(10);
  let at = head.writeInt16BE(COMPOSITE_CONTOURS, 0);
  for (let index = 0; index < 4; index += 1) at = head.writeInt16BE(streams.bbox.i16(), at);
  const { parts, instructed } = readComponents(streams.composite);
  if (!instructed) return Buffer.concat([head, ...parts]);
  const length = streams.glyph.u255();
  const size = Buffer.alloc(2);
  size.writeUInt16BE(length, 0);
  return Buffer.concat([head, ...parts, size, streams.instruction.bytes(length)]);
};

export { compositeGlyph };
