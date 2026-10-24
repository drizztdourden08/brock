/* @layer renderer-shell @kind test */
import { createElement as h } from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { CONTROLLER_LAYOUT_VARIANTS, CONTROLLER_SLOT_IDS, ControllerLayout } from '../src/compounds/ControllerLayout';
import type { ControllerLayoutProps, ControllerLayoutVariant } from '../src/compounds/ControllerLayout';
import { controllerGeometry } from '../src/compounds/ControllerLayout/behavior/controller-geometry';
import { fallbackRows } from '../src/compounds/ControllerLayout/behavior/fallback-rows';
import { heldLines } from '../src/compounds/ControllerLayout/behavior/held-lines';
import { placedIds } from '../src/compounds/ControllerLayout/behavior/placed-ids';
import { CONTROLLER_STRINGS } from '../src/compounds/ControllerLayout/ControllerLayout.constants';

const strings = CONTROLLER_STRINGS;

const render = (props: Partial<ControllerLayoutProps> = {}) => renderToString(h(ControllerLayout, { variant: 'offset', slots: {}, ...props }));

const hiddenList = (html: string) => {
  const list = /<ul class="input-controller-layout__held" aria-label="Held now">(.*?)<\/ul>/.exec(html);
  const items = list?.[1] ?? '';
  return [...items.matchAll(/<li>(.*?)<\/li>/g)].map((match) => match[1]);
};

describe('ControllerLayout', () => {
  it('names the agreed slots and variants', () => {
    expect(CONTROLLER_SLOT_IDS).toHaveLength(20);
    expect(CONTROLLER_SLOT_IDS).toContain('stick.right.click');
    expect(CONTROLLER_LAYOUT_VARIANTS).toEqual(['offset', 'symmetric', 'nintendo', 'pad']);
  });

  it('is a named figure with its drawing hidden and nothing held', () => {
    const html = render();
    expect(html).toMatch(/^<figure aria-label="Controller" class="input-controller-layout" data-variant="offset">/);
    expect(html).toMatch(/<svg class="input-controller-layout__art"[^>]*aria-hidden="true"/);
    expect(html).not.toContain('data-active=""');
    expect(hiddenList(html)).toEqual(['Nothing held']);
    expect(render({ label: 'Pad 1' })).toContain('aria-label="Pad 1"');
  });

  it('lights a held button and shows its label on it', () => {
    const html = render({ slots: { 'face.south': { pressed: true, label: 'A' }, 'face.east': { label: 'B' } } });
    expect(html.match(/class="input-controller-layout__control"[^>]*data-active=""/g)).toHaveLength(1);
    expect(html).toMatch(/class="input-controller-layout__tag" data-at="on" data-kind="button" data-active=""[^>]*>A</);
    expect(html).toMatch(/class="input-controller-layout__tag" data-at="on" data-kind="button" style="[^"]*">B</);
    expect(hiddenList(html)).toEqual(['A']);
  });

  it('fills a trigger sent with value only and reads it as a share', () => {
    const html = render({ slots: { 'trigger.left': { value: 0.6 }, 'trigger.right': { value: 0 } } });
    const levels = [...html.matchAll(/class="input-controller-layout__level"[^>]*?height="([\d.]+)"/g)].map((match) => Number(match[1]));
    expect(levels.filter((level) => level > 0)).toHaveLength(1);
    expect(levels).toContain(0);
    expect(hiddenList(html)).toEqual(['Left trigger 60%']);
  });

  it('moves the stick cap with y up and lights the cap on a click', () => {
    const html = render({ slots: { 'stick.left': { x: 0.5, y: 0.5 }, 'stick.right.click': { pressed: true } } });
    expect(html).toMatch(/transform="translate\(6\.76\d* -6\.76\d*\)"/);
    expect(html).toMatch(/class="input-controller-layout__stick" data-moved=""/);
    expect(html).toMatch(/class="input-controller-layout__stick" data-clicked=""/);
    expect(hiddenList(html)).toEqual(['Left stick at 0.50, 0.50', 'Right stick click']);
  });

  it('keeps a resting stick out of the held list', () => {
    expect(hiddenList(render({ slots: { 'stick.left': { x: 0.02, y: -0.03 } } }))).toEqual(['Nothing held']);
  });

  it('lists the slots a pad cannot place and each extra, one row each', () => {
    const extras = [{ id: 'paddle1', label: 'Upper right paddle', pressed: true }, { id: 'misc2', label: 'Touchpad click' }];
    const html = render({ variant: 'pad', slots: { 'trigger.left': { value: 0.45 }, 'face.south': {} }, extras });
    const rows = [...html.matchAll(/class="input-controller-layout__row"( data-active="")?.*?class="[^"]*input-controller-layout__row-label[^"]*"[^>]*>(.*?)</g)]
      .map((match) => `${match[2]}${match[1] ? ' held' : ''}`);
    expect(html).toContain('aria-label="Other inputs"');
    expect(rows).toEqual(['Left trigger held', 'Upper right paddle held', 'Touchpad click']);
    expect(html).toContain('>45%<');
    expect(html).not.toContain('input-controller-layout__stick');
  });
});

describe('ControllerLayout geometry', () => {
  it('places every slot but the triggers, sticks and capture on a pad', () => {
    const pad = placedIds(controllerGeometry('pad'));
    const missing = CONTROLLER_SLOT_IDS.filter((id) => !pad.has(id));
    expect(missing).toEqual(['trigger.left', 'trigger.right', 'stick.left', 'stick.right', 'stick.left.click', 'stick.right.click', 'meta.capture']);
  });

  it('places every slot on the other variants', () => {
    const variants: ControllerLayoutVariant[] = ['offset', 'symmetric', 'nintendo'];
    for (const variant of variants) {
      expect(placedIds(controllerGeometry(variant)).size).toBe(CONTROLLER_SLOT_IDS.length);
    }
  });

  it('builds rows and held lines from plain data', () => {
    const slots = { 'stick.left': { x: 1, y: 0 }, 'meta.capture': { pressed: true } };
    const placed = placedIds(controllerGeometry('pad'));
    expect(fallbackRows(slots, placed, [], strings).map((row) => [row.id, row.active])).toEqual([['stick.left', true], ['meta.capture', true]]);
    expect(heldLines(slots, [{ id: 'paddle1', label: 'Paddle', value: 0.25 }], strings)).toEqual(['Left stick at 1.00, 0.00', 'Capture', 'Paddle 25%']);
  });
});
