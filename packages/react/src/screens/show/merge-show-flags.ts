/* @layer renderer-shell @kind logic */
import { APP_FLAGS_SOURCE } from './show.constants';
import type { ShowFlagValues } from './show.type';

const mergeShowFlags = (sources: Readonly<Record<string, ShowFlagValues>>): ShowFlagValues => {
  const { [APP_FLAGS_SOURCE]: app, ...others } = sources;
  return Object.freeze(Object.assign({}, ...Object.values(others), app) as ShowFlagValues);
};

export { mergeShowFlags };
