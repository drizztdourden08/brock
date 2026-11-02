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

describe('K2 a bucket header file', { tags: ['critical'] }, () => {
  const Title = () => createElement('b', null, 'title');
  const Buttons = () => createElement('i', null, 'buttons');
  const own = { render: () => 'config' };

  it('wins over the screens.config header and builds render and actions from the components', () => {
    const withConfig: ScreensConfig = { buckets: [{ id: 'library', title: 'Library', icon: 'house', menu: 'entry', header: own }], home: 'library' };
    expect(buildScreenTree(withConfig, entries()).hubs[0]?.header).toBe(own);
    const file: ScreenEntry = { kind: 'header', bucket: 'library', id: 'library', component: Title, actions: Buttons };
    const header = buildScreenTree(withConfig, entries([file])).hubs[0]?.header;
    expect(header?.render).not.toBe(own.render);
    expect(header?.actions).toBeTypeOf('function');
    const plain: ScreenEntry = { kind: 'header', bucket: 'library', id: 'library', component: Title };
    expect(buildScreenTree(config(), entries([plain])).hubs[0]?.header?.actions).toBeUndefined();
  });
});
