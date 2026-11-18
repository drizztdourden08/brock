/* @layer core @kind logic */
import type { Cursor } from './parse.type';
import { isCloseTag } from './cursor/is-close-tag';
import { isOpenTag } from './cursor/is-open-tag';
import { peek } from './cursor/peek';

const readQuoted = (c: Cursor): string => {
  let out = '';
  c.pos += 1;
  while (c.pos < c.src.length) {
    const ch = peek(c);
    if (ch === "'" && peek(c, 1) === "'") {
      out += "'";
      c.pos += 2;
    } else if (ch === "'") {
      c.pos += 1;
      return out;
    } else {
      out += ch;
      c.pos += 1;
    }
  }
  return out;
};

const readApostrophe = (c: Cursor): string => {
  const next = peek(c, 1);
  if (next === "'") {
    c.pos += 2;
    return "'";
  }
  if (next === '{' || next === '}') return readQuoted(c);
  c.pos += 1;
  return "'";
};

const isStop = (c: Cursor, pound: boolean): boolean => {
  const ch = peek(c);
  return ch === '{' || ch === '}' || (pound && ch === '#') || isOpenTag(c) || isCloseTag(c);
};

const readText = (c: Cursor, pound: boolean): string => {
  let out = '';
  while (c.pos < c.src.length && !isStop(c, pound)) {
    if (peek(c) === "'") {
      out += readApostrophe(c);
    } else {
      out += peek(c);
      c.pos += 1;
    }
  }
  return out;
};

export { readText };
