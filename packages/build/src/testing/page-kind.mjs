/* @layer tooling-scripts @kind logic */
import { SPLASH_PAGE, WIDGET_QUERY_KEY } from './testing.constants.mjs';

const parse = (url) => {
  try {
    return new URL(url);
  } catch {
    return null;
  }
};

/**
 * @param {string} url a Brock window's page URL
 * @returns {'splash' | 'widget' | 'app' | null} which window it is; null while it has no page yet
 */
const pageKindOf = (url) => {
  const parsed = parse(url);
  if (!parsed || parsed.protocol === 'about:') return null;
  if (SPLASH_PAGE.test(parsed.pathname)) return 'splash';
  if (parsed.searchParams.has(WIDGET_QUERY_KEY)) return 'widget';
  return 'app';
};

export { pageKindOf };
