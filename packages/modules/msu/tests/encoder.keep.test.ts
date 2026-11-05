/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import { parseProbeJson } from '../src/main/encoder/ffprobe-parse';
import { encodeArgs } from '../src/main/optimize/encode-args';

describe('encodeArgs', { tags: ['critical'] }, () => {
  it('maps the first audio stream to flac and ends with the destination', () => {
    const args = encodeArgs({ inputArgs: ['-f', 's16le'], sourcePath: 'in.pcm', destPath: 'out.flac' });
    expect(args).toContain('flac');
    expect(args.slice(args.indexOf('-i'), args.indexOf('-i') + 2)).toEqual(['-i', 'in.pcm']);
    expect(args.at(-1)).toBe('out.flac');
    expect(args).not.toContain('-t');
  });

  it('limits the length when seconds is given', () => {
    const args = encodeArgs({ inputArgs: [], sourcePath: 'a', destPath: 'b', seconds: 4 });
    expect(args.slice(args.indexOf('-t'), args.indexOf('-t') + 2)).toEqual(['-t', '4']);
  });
});

describe('parseProbeJson', { tags: ['critical'] }, () => {
  it('reads the audio stream and falls back to the format duration', () => {
    const raw = JSON.stringify({
      streams: [{ codec_type: 'video' }, { codec_type: 'audio', sample_rate: '44100', channels: 2 }],
      format: { duration: '12.5', bit_rate: '320000' },
    });
    expect(parseProbeJson(raw)).toEqual({ durationSeconds: 12.5, sampleRate: 44100, channels: 2, bitRate: 320000 });
  });

  it('returns null for bad json or a file without audio', () => {
    expect(parseProbeJson('not json')).toBeNull();
    expect(parseProbeJson(JSON.stringify({ streams: [{ codec_type: 'video' }] }))).toBeNull();
  });
});
