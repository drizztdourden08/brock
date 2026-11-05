/* @layer renderer-shell @kind logic */
import type { RandomizerPage } from './randomizer-page.type';

const findPageOverride = (pages: readonly RandomizerPage[], key: string): RandomizerPage | null => pages.find((page) => page.key === key) ?? null;

export { findPageOverride };
