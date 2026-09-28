/* @layer renderer-shell @kind logic */
import type { EmscriptenFactory } from './emscripten.type';

const pending = new Map<string, Promise<void>>();

const factoryOf = (name: string): EmscriptenFactory | null => {
  const value: unknown = (globalThis as Record<string, unknown>)[name];
  return typeof value === 'function' ? (value as EmscriptenFactory) : null;
};

const injectScript = (url: string): Promise<void> =>
  new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = url;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`The core glue script ${url} did not load.`));
    document.head.appendChild(script);
  });

const loadGlueScript = async (url: string, factoryName: string): Promise<EmscriptenFactory> => {
  const ready = factoryOf(factoryName);
  if (ready) return ready;
  const loading = pending.get(url) ?? injectScript(url);
  pending.set(url, loading);
  await loading;
  const factory = factoryOf(factoryName);
  if (!factory) throw new Error(`The core glue ${url} did not define "${factoryName}".`);
  return factory;
};

export { loadGlueScript };
