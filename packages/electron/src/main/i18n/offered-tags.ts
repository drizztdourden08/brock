/* @layer electron-main @kind logic */
import type { MainLocales } from './main-locales.type';

const offeredTags = (locales: MainLocales | undefined): readonly string[] =>
  locales ? [locales.base, ...Object.keys(locales.loaders).filter((tag) => tag !== locales.base)] : ['en'];

export { offeredTags };
