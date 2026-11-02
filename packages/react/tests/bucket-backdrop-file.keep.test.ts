/* @layer renderer-shell @kind test */
import { createElement } from 'react';
import { describe, expect, it } from 'vitest';
import { buildScreenTree } from '../src/screens/conventions/build-screen-tree';
import type { ScreenEntry } from '../src/screens/conventions/screen-tree.type';
import type { ScreensConfig } from '../src/screens/conventions/screens-config.type';

const View = () => null;
const Art = () => createElement('i', { className: 'library-art' });

const config = (backdrop?: ScreensConfig['buckets'][number]['backdrop']): ScreensConfig => ({
  buckets: [{ id: 'library', title: 'Library', icon: 'house', menu: 'entry', ...(backdrop ? { backdrop } : {}) }],
  home: 'library',
});

const entries = (art: ScreenEntry[] = []): ScreenEntry[] => [
  { kind: 'page', bucket: 'library', id: 'shelf', component: View },
  ...art,
];

describe('K1 a bucket backdrop file', { tags: ['critical'] }, () => {
  it('wins over the screens.config backdrop, which stays the backdrop without a file', () => {
    const color = { kind: 'color', color: 'teal' } as const;
    expect(buildScreenTree(config(color), entries()).hubs[0]?.backdrop).toEqual(color);
    expect(buildScreenTree(config(color), entries([{ kind: 'backdrop', bucket: 'library', id: 'library', component: Art }])).hubs[0]?.backdrop?.kind).toBe('node');
  });
});
