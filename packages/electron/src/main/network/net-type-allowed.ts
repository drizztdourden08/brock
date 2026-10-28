/* @layer electron-main @kind logic */
const matches = (pattern: string, type: string): boolean => (pattern.endsWith('/*') ? type.startsWith(pattern.slice(0, -1)) : pattern === type);

const mediaTypeOf = (header: string | null): string | null => {
  const type = header?.split(';')[0]?.trim().toLowerCase();
  return type === undefined || type === '' ? null : type;
};

const netTypeAllowed = (header: string | null, allowed: readonly string[], narrowed: readonly string[] | undefined): string => {
  const type = mediaTypeOf(header);
  if (type === null) throw new Error('net.read refused an answer with no content type');
  const fits = allowed.some((pattern) => matches(pattern, type)) && (narrowed === undefined || narrowed.some((pattern) => matches(pattern, type)));
  if (!fits) throw new Error(`net.read refused the content type "${type}"`);
  return type;
};

export { netTypeAllowed };
