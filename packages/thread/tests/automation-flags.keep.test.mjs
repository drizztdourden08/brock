/* @layer tooling-scripts @kind test */
import { describe, expect, it } from 'vitest';
import { automationFlags } from '../src/launch/automation-flags.mjs';

describe('automationFlags', () => {
  it('keeps a hidden launch automated and silent', () => {
    expect(automationFlags({ visible: false, sound: false })).toEqual(['--no-focus', '--muted']);
  });

  it('passes no automation flag for a visible launch, so it acts like a user launch', () => {
    expect(automationFlags({ visible: true, sound: false })).toEqual(['--visible', '--muted']);
    expect(automationFlags({ visible: true, sound: true })).toEqual(['--visible', '--sound']);
  });
});
