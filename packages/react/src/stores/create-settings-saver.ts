/* @layer renderer-shell @kind logic */
import type { SettingsSaveReport, SettingsSaver, SettingsWrite } from './settings-store.type';

const messageOf = (error: unknown): string => (error instanceof Error ? error.message : String(error));

const createSettingsSaver = <S>(
  save: (profileId: string, settings: S) => Promise<void>,
  delayMs: number,
  report: SettingsSaveReport,
): SettingsSaver<S> => {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let pending: SettingsWrite<S> | null = null;
  let failed: SettingsWrite<S> | null = null;

  const write = async (next: SettingsWrite<S>): Promise<void> => {
    report({ saveStatus: 'saving' });
    try {
      await save(next.profileId, next.settings);
      if (pending === null) report({ saveStatus: 'saved', saveError: null, savedAt: Date.now() });
    } catch (error) {
      failed = next;
      report({ saveStatus: 'failed', saveError: messageOf(error) });
    }
  };

  const flush = async (): Promise<void> => {
    if (timer) { clearTimeout(timer); timer = null; }
    const next = pending;
    pending = null;
    if (next) await write(next);
  };

  return {
    flush,
    schedule: (profileId, settings) => {
      pending = { profileId, settings };
      failed = null;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => { void flush(); }, delayMs);
    },
    retry: async () => {
      if (pending === null && failed !== null) pending = failed;
      failed = null;
      await flush();
    },
    clear: () => {
      if (timer) { clearTimeout(timer); timer = null; }
      pending = null;
      failed = null;
    },
  };
};

export { createSettingsSaver };
