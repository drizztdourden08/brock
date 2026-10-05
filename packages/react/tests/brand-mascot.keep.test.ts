/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { act, createElement, isValidElement } from 'react';
import type { ReactElement } from 'react';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import { AnimatedMascot, BrandMark } from '@drizztdourden08/tessera/brand';
import type { AnimatedMascotProps } from '@drizztdourden08/tessera/brand';
import { brandMascot } from '../src/brand/brand-mascot';
import { heroBrandArt } from '../src/screens/kinds/hero-brand-art';
import { useNoMatchClip } from '../src/search/BrandSearchResults/behavior/useNoMatchClip';

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

let root: Root | null = null;

afterEach(() => {
  act(() => root?.unmount());
  root = null;
});

const artNode = (brand: Parameters<typeof heroBrandArt>[0]): ReactElement => {
  const art = heroBrandArt(brand);
  if (art?.kind !== 'node' || !isValidElement(art.node)) throw new Error('the hero art is a node');
  return art.node;
};

describe('the brand mascot', () => {
  it('is the brand itself for a brand with a mascot, and none for Tessera or an unknown brand', () => {
    expect(brandMascot('brock')).toBe('brock');
    expect(brandMascot('archipelia')).toBe('archipelia');
    expect(brandMascot('rotp')).toBe('rotp');
    expect(brandMascot('tessera')).toBeNull();
    expect(brandMascot('acme')).toBeNull();
    expect(brandMascot(undefined)).toBeNull();
  });

  it('greets on the hero through AnimatedMascot brand auto, and falls back to the mark', () => {
    const mascot = artNode('brock');
    expect(mascot.type).toBe(AnimatedMascot);
    expect(mascot.props).toMatchObject({ brand: 'auto', animation: 'wave', size: 'xl' });
    expect(artNode('tessera').type).toBe(BrandMark);
    expect(artNode('tessera').props).toMatchObject({ app: 'tessera', ground: 'dark' });
    expect(heroBrandArt(undefined)).toBeUndefined();
  });
});

describe('the no match mascot', () => {
  it('cuts in with alert for each new query, then settles into worried once the clip ends', () => {
    const seen: { animation: AnimatedMascotProps['animation']; onFinish: () => void }[] = [];
    const Probe = (props: { query: string }) => {
      seen.push(useNoMatchClip(props.query));
      return null;
    };
    root = createRoot(document.createElement('div'));
    act(() => root?.render(createElement(Probe, { query: 'zz' })));
    expect(seen.at(-1)?.animation).toBe('alert');
    act(() => seen.at(-1)?.onFinish());
    expect(seen.at(-1)?.animation).toBe('worried');
    act(() => root?.render(createElement(Probe, { query: 'zzz' })));
    expect(seen.at(-1)?.animation).toBe('alert');
  });
});
