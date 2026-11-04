/* @layer renderer-shell @kind test */
import { describe, expect, it } from 'vitest';
import type { ReviewEnv } from '../src/review/review.type';
import type { ScreenDef } from '../src/screens/screen.type';
import { squareScreen } from '../src/review/widgets/square-screen';

const screen = (id: string, layer?: ScreenDef['layer']): ScreenDef => ({ id, title: id, icon: null, render: () => null, ...(layer === undefined ? {} : { layer }) });

const env = (screens: ScreenDef[]): Pick<ReviewEnv, 'screens' | 'homeScreen'> => ({ homeScreen: 'home', screens });

describe('K1 squareScreen', { tags: ['critical'] }, () => {
  it('skips own-layer screens such as About and the home screen', () => {
    expect(squareScreen(env([screen('home'), screen('about', 'own'), screen('settings')]))).toBe('settings');
    expect(squareScreen(env([screen('home'), screen('about', 'own'), screen('rooms')]))).toBe('rooms');
  });

  it('prefers settings, then profiles, and is null when no screen draws a layer', () => {
    expect(squareScreen(env([screen('rooms'), screen('profiles'), screen('settings')]))).toBe('settings');
    expect(squareScreen(env([screen('rooms'), screen('profiles')]))).toBe('profiles');
    expect(squareScreen(env([screen('home'), screen('about', 'own')]))).toBeNull();
  });
});
