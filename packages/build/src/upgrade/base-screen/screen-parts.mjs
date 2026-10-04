/* @layer tooling-scripts @kind logic */
const UNSUPPORTED = /\b(?:subtitle|extra|floating|keepMounted|shortcut|group)\s*:/;
const TITLE = /\btitle:\s*(['"`])([^'"`]*)\1/;
const ICON = /\bicon:\s*(?:createElement\(\s*Icon\s*,\s*\{\s*name:\s*)?(['"])([a-z0-9-]+)\1/;
const RENDER = /\brender:\s*\(\s*\)\s*=>\s*(?:createElement\(\s*([A-Z][\w$]*)\s*\)|<([A-Z][\w$]*)\s*\/>)/;

/**
 * @param {string} body the object a defineScreen call takes
 * @returns {{ title: string, icon: string | null, component: string, requiresProfile: boolean } | null} null when a file cannot hold it
 */
const screenParts = (body) => {
  const title = TITLE.exec(body)?.[2];
  const render = RENDER.exec(body);
  const component = render?.[1] ?? render?.[2];
  if (UNSUPPORTED.test(body) || title === undefined || component === undefined) return null;
  return { title, icon: ICON.exec(body)?.[2] ?? null, component, requiresProfile: !/\brequiresProfile:\s*false\b/.test(body) };
};

export { screenParts };
