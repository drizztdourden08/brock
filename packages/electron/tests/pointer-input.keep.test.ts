/* @layer electron-main @kind test */
import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const root = join(__dirname, '..', 'src');

const sources = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? sources(path) : /\.ts$/.test(name) ? [path] : [];
  });

const FLAGS = /(?:disable-features|disable-blink-features|disable-gpu|disable-input|disable-pointer)[^\n]*/g;
const POINTER_FEATURE = /pointer|touch|stylus|pen|ink|input|coalesc|raw/i;

describe('pointer input reaches the renderer', () => {
  it('turns off no Chromium feature that carries pointer, pen or touch input', () => {
    const found: string[] = [];
    for (const file of sources(root)) {
      for (const line of readFileSync(file, 'utf8').matchAll(FLAGS)) if (POINTER_FEATURE.test(line[0])) found.push(`${file}: ${line[0]}`);
    }
    expect(found).toEqual([]);
  });

  it('keeps the window web preferences free of switches that change input events', () => {
    const text = readFileSync(join(root, 'main', 'window', 'create-window.ts'), 'utf8');
    expect(text).not.toMatch(/disableBlinkFeatures|enableBlinkFeatures|touchEvents|disableHtmlFullscreenWindowResize/);
  });
});
