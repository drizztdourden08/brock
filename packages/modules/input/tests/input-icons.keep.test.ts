/* @layer renderer-shell @kind test */
import { describe, expect, it } from 'vitest';
import { controlIcon, inputFamilyOf } from '../src/compounds/CalibrationPanel';

describe('inputFamilyOf', () => {
  it('picks the family from the vendor id, generic otherwise', () => {
    expect(inputFamilyOf(0x045e)).toBe('xbox');
    expect(inputFamilyOf(0x054c)).toBe('playstation');
    expect(inputFamilyOf(0x057e)).toBe('switch');
    expect(inputFamilyOf(0x2dc8)).toBe('generic');
    expect(inputFamilyOf(undefined)).toBe('generic');
  });
});

describe('controlIcon', () => {
  it('draws an SDL button by its position in the family', () => {
    expect(controlIcon('xbox', 'button', 'SOUTH')).toEqual({ family: 'xbox', name: 'a' });
    expect(controlIcon('playstation', 'button', 'EAST')).toEqual({ family: 'playstation', name: 'circle' });
    expect(controlIcon('switch', 'button', 'SOUTH')).toEqual({ family: 'switch', name: 'b' });
    expect(controlIcon('xbox', 'button', 'DPAD_UP')).toEqual({ family: 'xbox', name: 'dpad-up' });
  });

  it('draws sticks and triggers, and nothing for an id the family lacks', () => {
    expect(controlIcon('xbox', 'stick', 'LEFT_STICK')).toEqual({ family: 'xbox', name: 'stick-l' });
    expect(controlIcon('generic', 'stick', 'RIGHT_STICK')).toEqual({ family: 'generic', name: 'stick' });
    expect(controlIcon('playstation', 'trigger', 'RIGHT_TRIGGER')).toEqual({ family: 'playstation', name: 'r2' });
    expect(controlIcon('xbox', 'button', 'MISC6')).toBeNull();
  });
});
