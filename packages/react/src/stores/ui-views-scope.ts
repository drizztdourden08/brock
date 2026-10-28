/* @layer renderer-shell @kind logic */
import { isRecord } from '../collections/is-record';
import { scopeLimits } from './scope-limits';
import { UI_VIEWS_SCOPE_PREFIX } from './ui-views-scope.constants';
import type { ScopeOptions, ScopeRecord, UiViewScope } from './ui-views-scope.type';
import { uiViewsFile } from './ui-views-file';

let lastStamp = 0;

const stamp = (): number => {
  lastStamp = Math.max(Date.now(), lastStamp + 1);
  return lastStamp;
};

const emptyRecord = (): ScopeRecord => ({ at: 0, order: [], values: {} });

const recordOf = (raw: unknown): ScopeRecord => {
  if (!isRecord(raw)) return emptyRecord();
  const { values, order, at } = raw;
  if (!isRecord(values) || !Array.isArray(order)) return emptyRecord();
  return { at: typeof at === 'number' ? at : 0, order: order.filter((name): name is string => typeof name === 'string' && name in values), values };
};

const storeKeyOf = (key: string): string => {
  if (key === '') throw new Error('A ui-views scope needs a key');
  return `${UI_VIEWS_SCOPE_PREFIX}${key}`;
};

const trimScopes = (all: Record<string, unknown>, keep: string): Promise<void>[] => {
  const held = Object.keys(all).filter((name) => name.startsWith(UI_VIEWS_SCOPE_PREFIX));
  if (held.length <= scopeLimits.current.maxScopes) return [];
  const oldest = held.filter((name) => name !== keep).sort((a, b) => recordOf(all[a]).at - recordOf(all[b]).at);
  return oldest.slice(0, held.length - scopeLimits.current.maxScopes).map((name) => uiViewsFile.set(name, undefined));
};

const evict = (record: ScopeRecord, cap: number): void => {
  while (record.order.length > cap) {
    const oldest = record.order.shift();
    if (oldest !== undefined) Reflect.deleteProperty(record.values, oldest);
  }
};

let tail: Promise<void> = Promise.resolve();

const inTurn = (job: () => Promise<void>): Promise<void> => {
  const run = tail.then(job);
  tail = run.catch(() => undefined);
  return run;
};

const scope = (key: string, options: ScopeOptions = {}): UiViewScope => {
  const storeKey = storeKeyOf(key);
  const cap = (): number => scopeLimits.positive('maxKeys', options.maxKeys ?? scopeLimits.current.maxKeys);

  const load = async (): Promise<ScopeRecord> => recordOf((await uiViewsFile.load())[storeKey]);

  const save = async (record: ScopeRecord): Promise<void> => {
    if (record.order.length === 0) {
      await uiViewsFile.set(storeKey, undefined);
      return;
    }
    await uiViewsFile.set(storeKey, { ...record, at: stamp() });
    await Promise.all(trimScopes(await uiViewsFile.load(), storeKey));
  };

  const writeNow = async (name: string, value: unknown): Promise<void> => {
    const record = await load();
    const values = { ...record.values };
    const order = record.order.filter((held) => held !== name);
    if (value === undefined) Reflect.deleteProperty(values, name);
    else {
      values[name] = value;
      order.push(name);
    }
    const next = { at: record.at, order, values };
    evict(next, cap());
    await save(next);
  };

  const write = (name: string, value: unknown): Promise<void> => inTurn(() => writeNow(name, value));

  return {
    key,
    read: async <T,>(name: string, fallback: T): Promise<T> => {
      const { values } = await load();
      return name in values ? (values[name] as T) : fallback;
    },
    readAll: async () => ({ ...(await load()).values }),
    write,
    remove: (name) => write(name, undefined),
    clear: () => inTurn(() => uiViewsFile.set(storeKey, undefined)),
  };
};

export { scope };
