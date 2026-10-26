/* @layer renderer-shell @kind test */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const css = (path: string): string => readFileSync(new URL(`../src/${path}`, import.meta.url), 'utf8');
const rule = (source: string, selector: string): string => {
  const start = source.indexOf(`${selector} {`);
  return start < 0 ? '' : source.slice(start, source.indexOf('}', start));
};

describe('screen scrollers', () => {
  it.each([
    ['screens/ScreenLayer/ScreenLayer.css', '.brock-page-body'],
    ['screens/ScreenLayer/ScreenLayer.css', '.brock-info-card'],
    ['hub/Hub/Hub.css', '.hub__solo'],
    ['hub/Hub/Hub.css', '.hub__plain-body'],
    ['compounds/ReleaseNotesPanel/ReleaseNotesPanel.css', '.release-notes-panel__content'],
  ])('keep a stable scrollbar gutter in %s %s', (file, selector) => {
    expect(rule(css(file), selector)).toContain('scrollbar-gutter: stable');
  });
});
