/* @layer renderer-shell @kind logic */
const routeText = (params: Record<string, unknown>): string | null => {
  const parts = Object.entries(params)
    .filter(([, value]) => typeof value === 'string' || typeof value === 'number')
    .map(([key, value]) => `${key}=${String(value)}`);
  return parts.length > 0 ? parts.join(' ') : null;
};

export { routeText };
