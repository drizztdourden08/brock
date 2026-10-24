/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import { createAutomationFlags } from '../src/automation/flags';

describe('createAutomationFlags', () => {
  const flags = createAutomationFlags(['--auto-state']);

  it('treats a base flag, bare or with a value, as automation', () => {
    expect(flags.isAutomationLaunch(['node', 'app', '--no-focus'])).toBe(true);
    expect(flags.isAutomationLaunch(['node', 'app', '--window-size=1280x800'])).toBe(true);
    expect(flags.isAutomationLaunch(['node', 'app'])).toBe(false);
  });

  it('counts an app flag added at creation', () => {
    expect(flags.isAutomationLaunch(['node', 'app', '--auto-state=3'])).toBe(true);
  });

  it('keeps an identity-only launch visible and honours --visible', () => {
    expect(flags.isHeadlessLaunch(['node', 'app', '--instance=probe'])).toBe(false);
    expect(flags.isHeadlessLaunch(['node', 'app', '--no-focus'])).toBe(true);
    expect(flags.isHeadlessLaunch(['node', 'app', '--no-focus', '--visible'])).toBe(false);
  });

  it('sees --background as a background launch, and never in an automation launch', () => {
    expect(flags.isBackgroundLaunch(['node', 'app', '--background'])).toBe(true);
    expect(flags.isBackgroundLaunch(['node', 'app'])).toBe(false);
    expect(flags.isBackgroundLaunch(['node', 'app', '--background', '--no-focus'])).toBe(false);
    expect(flags.isAutomationLaunch(['node', 'app', '--background'])).toBe(false);
    expect(flags.isHeadlessLaunch(['node', 'app', '--background'])).toBe(false);
  });

  it('reads a flag value', () => {
    expect(flags.flagValue('--instance', ['node', 'app', '--instance=probe'])).toBe('probe');
    expect(flags.flagValue('--instance', ['node', 'app'])).toBeNull();
  });
});
