/* @layer electron-main @kind logic */
import { externalProtocols } from './external-protocols';

const parse = (url: string): URL | null => {
  try {
    return new URL(url);
  } catch {
    return null;
  }
};

const samePage = (from: URL, to: URL): boolean => (to.origin === 'null'
  ? to.protocol === from.protocol && to.host === from.host && to.pathname === from.pathname
  : to.origin === from.origin);

const navigationVerdict = (current: string, target: string, allowed: ReadonlySet<string> = externalProtocols.allowed): 'stay' | 'external' | 'block' => {
  const to = parse(target);
  if (to === null) return 'block';
  const from = parse(current);
  if (from !== null && samePage(from, to)) return 'stay';
  return allowed.has(to.protocol) ? 'external' : 'block';
};

export { navigationVerdict };
