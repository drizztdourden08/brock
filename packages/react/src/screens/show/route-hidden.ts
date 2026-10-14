/* @layer renderer-shell @kind logic */
const routeHidden = (route: string, hidden: ReadonlySet<string>): boolean =>
  [...hidden].some((prefix) => route === prefix || route.startsWith(`${prefix}/`));

export { routeHidden };
