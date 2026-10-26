/* @layer renderer-shell @kind test */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const source = (path: string): string => readFileSync(new URL(`../src/${path}`, import.meta.url), 'utf8');

describe('screen scrollers', () => {
  it.each([
    ['screens/ScreenLayer/ScreenLayer.tsx', 'brock-page-body'],
    ['screens/ScreenLayer/ScreenLayer.tsx', 'brock-info-card'],
    ['hub/Hub/sub-components/HubBody/HubBody.tsx', 'hub__solo'],
    ['hub/Hub/sub-components/HubPlainPage/HubPlainPage.tsx', 'screen-page__body'],
    ['compounds/ReleaseNotesPanel/ReleaseNotesPanel.tsx', 'release-notes-panel__content'],
  ])('ask for a stable scrollbar gutter in %s on %s', (file, className) => {
    expect(source(file)).toMatch(new RegExp(`<ScrollArea className="[^"]*${className}[^"]*" gutter="stable"`));
  });
});
