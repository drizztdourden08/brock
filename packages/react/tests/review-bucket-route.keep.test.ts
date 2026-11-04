/* @layer renderer-shell @kind test */
import { describe, expect, it } from 'vitest';
import type { HubDef } from '../src/hub/hub.type';
import type { ResolvedScreenTree } from '../src/screens/conventions/screen-tree.type';
import type { ReviewEnv } from '../src/review/review.type';
import { bucketRoute } from '../src/review/steps/bucket-route';
import { isUnlinked } from '../src/review/steps/is-unlinked';

const hub = (id: string, switcher?: boolean): HubDef => ({ id, title: id, icon: null, home: { id: `${id}-home`, label: id, icon: null, render: () => null }, groups: [], switcher });

const env = (menu: ReviewEnv['menu'] = []): ReviewEnv =>
  ({ screenTree: { home: 'project', settingsBucket: 'options' } as ResolvedScreenTree, menu }) as ReviewEnv;

describe('K1 bucketRoute', { tags: ['critical'] }, () => {
  it('names Home for the home bucket and the gear for the settings bucket', () => {
    expect(bucketRoute(env(), hub('project'))).toBe('Home and Escape');
    expect(bucketRoute(env(), hub('options'))).toBe('the settings gear');
    expect(bucketRoute(env(), hub('other'))).toBeNull();
  });

  it('flags only a bucket with no switcher, no menu entry and no route', () => {
    expect(isUnlinked(env(), hub('options', false))).toBe(false);
    expect(isUnlinked(env(), hub('project', false))).toBe(false);
    expect(isUnlinked(env(), hub('other', false))).toBe(true);
    expect(isUnlinked(env(), hub('other'))).toBe(false);
    expect(isUnlinked(env([{ key: 'other', label: 'Other', screen: 'other' }]), hub('other', false))).toBe(false);
  });
});
