/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import { normalizeReply } from '../src/normalize-reply';

describe('K4 tool replies', { tags: ['critical'] }, () => {
  it('turns a string into text', () => {
    expect(normalizeReply('hello')).toEqual({ text: 'hello', images: [], isError: false });
  });

  it('turns no reply into ok', () => {
    expect(normalizeReply(undefined)).toEqual({ text: 'ok', images: [], isError: false });
  });

  it('turns JSON into text, with data for an object only', () => {
    expect(normalizeReply({ ok: true, count: 2 })).toEqual({ text: '{"ok":true,"count":2}', data: { ok: true, count: 2 }, images: [], isError: false });
    expect(normalizeReply([1, 2])).toEqual({ text: '[1,2]', images: [], isError: false });
    expect(normalizeReply(5)).toEqual({ text: '5', images: [], isError: false });
    expect(normalizeReply(null)).toEqual({ text: 'null', images: [], isError: false });
  });

  it('reads the text, data, images and isError envelope', () => {
    const images = [{ data: 'AAAA', mimeType: 'image/png' }];
    expect(normalizeReply({ text: 'shot', data: { width: 2 }, images })).toEqual({ text: 'shot', data: { width: 2 }, images, isError: false });
    expect(normalizeReply({ text: 'bad', isError: true })).toEqual({ text: 'bad', images: [], isError: true });
    expect(normalizeReply({ data: { a: 1 } })).toEqual({ text: '{"a":1}', data: { a: 1 }, images: [], isError: false });
  });

  it('treats an object with other keys, or wrong parts, as plain JSON', () => {
    expect(normalizeReply({ text: 'x', extra: 1 }).data).toEqual({ text: 'x', extra: 1 });
    expect(normalizeReply({ text: 5 }).text).toBe('{"text":5}');
    expect(normalizeReply({}).text).toBe('{}');
  });

  it('turns an unserializable reply into an error', () => {
    const loop: Record<string, unknown> = {};
    loop.self = loop;
    const result = normalizeReply(loop as never);
    expect(result.isError).toBe(true);
    expect(result.images).toEqual([]);
  });
});
