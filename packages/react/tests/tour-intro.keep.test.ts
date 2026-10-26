/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { createElement } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { defineProduct } from '@drizztdourden08/brock-core';
import { Icon } from '@drizztdourden08/tessera/primitives';
import { BrockContext } from '../src/app/brock-context';
import type { BrockContextValue } from '../src/app/brock-context.type';
import { defineTour } from '../src/tours/define-tour';
import { ProductMark } from '../src/tours/ProductMark';
import { toGuidedSteps } from '../src/tours/to-guided-steps';
import type { TourStepDef } from '../src/tours/tour.type';
import { showHarness } from './show-harness';

const PRODUCT = { id: 'demo', name: 'Demo', appId: 'com.example.demo', ports: { base: 35800 }, description: 'A test app.', author: { name: 'tester', email: 'tester@example.com' } };

const brockOf = (brand?: 'brock'): BrockContextValue => ({
  product: defineProduct(brand ? { ...PRODUCT, icons: { brand } } : PRODUCT),
  ...{ home: 'library', homeScreen: 'library', tabs: [], settingsControls: {}, menu: [], shortcuts: [], screenTree: null, moduleIds: [] },
  logoSrc: 'logo.png',
  instanceLogoSrc: '',
});

const tourOf = (step: Omit<TourStepDef, 'id' | 'title' | 'body'>) =>
  defineTour({ id: 'intro', title: 'Intro', steps: [{ id: 'welcome', title: 'Welcome', body: 'Hello', ...step }] });

afterEach(showHarness.resetShow);

describe('toGuidedSteps intro panel', () => {
  it('passes intro, art and reveal to the guided step', () => {
    const reveal = vi.fn();
    const art = createElement('span', null, 'art');
    const [step] = toGuidedSteps(tourOf({ intro: true, art, reveal }));
    expect(step?.intro).toBe(true);
    expect(step?.art).toBe(art);
    expect(step?.reveal).toBe(reveal);
  });

  it('turns the product-mark token into the product mark node', () => {
    const [step] = toGuidedSteps(tourOf({ intro: true, art: 'product-mark' }));
    expect(step?.art).toEqual(createElement(ProductMark));
  });

  it('turns an icon token into an icon', () => {
    const [step] = toGuidedSteps(tourOf({ art: { icon: 'compass' } }));
    expect(step?.art).toEqual(createElement(Icon, { name: 'compass', size: 64 }));
  });

  it('leaves a step without them as it was', () => {
    const [step] = toGuidedSteps(tourOf({}));
    expect(step && 'intro' in step).toBe(false);
    expect(step && 'art' in step).toBe(false);
    expect(step && 'reveal' in step).toBe(false);
  });

  it('keeps intro false when the step sets it', () => {
    const [step] = toGuidedSteps(tourOf({ intro: false }));
    expect(step?.intro).toBe(false);
  });
});

describe('ProductMark', () => {
  it('draws the brand mark of a branded product', () => {
    const root = showHarness.render(createElement(BrockContext.Provider, { value: brockOf('brock') }, createElement(ProductMark)));
    expect(root.querySelector('svg, img, canvas, [class*="logo"], [class*="brand"]')).not.toBeNull();
  });

  it('draws the product logo of an unbranded product', () => {
    const root = showHarness.render(createElement(BrockContext.Provider, { value: brockOf() }, createElement(ProductMark)));
    expect(root.querySelector('img')?.getAttribute('src')).toBe('logo.png');
  });

  it('draws nothing outside the app', () => {
    expect(showHarness.render(createElement(ProductMark)).childElementCount).toBe(0);
  });
});
