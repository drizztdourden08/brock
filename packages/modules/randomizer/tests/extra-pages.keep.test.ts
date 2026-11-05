/* @layer core @kind test */
import type { ShowContext } from '@drizztdourden08/brock-react';
import { describe, expect, it } from 'vitest';
import { mergeExtraPages } from '../src/renderer/bucket/merge-extra-pages';
import { orderVisiblePages } from '../src/renderer/bucket/order-visible-pages';
import type { RandomizerPage } from '../src/renderer/bucket/randomizer-page.type';

const page = (key: string, extra: Partial<RandomizerPage> = {}): RandomizerPage => ({ key, title: key, render: () => null, ...extra });
const ctx = { flags: {} } as ShowContext;

describe('extra pages', { tags: ['critical'] }, () => {
  it('keeps route, order and when through the merge', () => {
    const when = () => true;
    const merged = mergeExtraPages([page('a')], [page('b', { route: 'online', order: 4, when })]);
    expect(merged[1]).toMatchObject({ route: 'online', order: 4, when });
  });

  it('sorts by order with unordered pages after and hides a false when', () => {
    const pages = [page('plain'), page('online', { order: 4, when: () => false }), page('late', { order: 4 }), page('net', { order: 3 })];
    expect(orderVisiblePages(pages, ctx).map((entry) => entry.key)).toEqual(['net', 'late', 'plain']);
  });
});
