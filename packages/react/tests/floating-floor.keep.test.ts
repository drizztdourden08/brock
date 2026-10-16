/* @layer renderer-shell @kind test */
import { describe, expect, it } from 'vitest';
import { floatingRect } from '@drizztdourden08/tessera/composites';
import type { FloatingWidget } from '@drizztdourden08/tessera/composites';
import { floatingFloor } from '../src/review/widgets/floating-floor';
import { FLOATING_MIN } from '../src/widgets/widget.constants';

const mainOf = (width: number, height: number) => ({ x: 0, y: 32, width, height });

describe('the smallest size the floating widget review expects', () => {
  it('is the widget minimum when the main view is big enough', () => {
    expect(floatingFloor(FLOATING_MIN, mainOf(1200, 800))).toEqual(FLOATING_MIN);
    expect(floatingFloor(FLOATING_MIN, mainOf(FLOATING_MIN.width, FLOATING_MIN.height))).toEqual(FLOATING_MIN);
  });

  it('is held to the main view when the main view is narrower or shorter than the minimum', () => {
    expect(floatingFloor(FLOATING_MIN, mainOf(180, 600))).toEqual({ width: 180, height: FLOATING_MIN.height });
    expect(floatingFloor(FLOATING_MIN, mainOf(600, 120))).toEqual({ width: FLOATING_MIN.width, height: 120 });
    expect(floatingFloor(FLOATING_MIN, mainOf(180, 120))).toEqual({ width: 180, height: 120 });
  });

  it('is the widget minimum when no main view is drawn', () => {
    expect(floatingFloor(FLOATING_MIN, undefined)).toEqual(FLOATING_MIN);
  });
});

describe('a floating widget in a main view that shrinks and grows again', () => {
  const saved: FloatingWidget = { id: 'logs', x: 0, y: 0, width: 480, height: 320 };

  it('is drawn no larger than the main view while the view is small', () => {
    const drawn = floatingRect(saved, mainOf(180, 600));
    expect(drawn.width).toBe(180);
    expect(drawn.height).toBe(320);
  });

  it('keeps its saved size, so it comes back to it when the main view grows', () => {
    floatingRect(saved, mainOf(180, 600));
    expect(saved).toMatchObject({ width: 480, height: 320 });
    expect(floatingRect(saved, mainOf(1200, 800))).toMatchObject({ width: 480, height: 320 });
  });
});
