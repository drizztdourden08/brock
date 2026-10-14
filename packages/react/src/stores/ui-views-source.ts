/* @layer renderer-shell @kind logic */
import { detectHost } from '@drizztdourden08/brock-core';
import { isRecord } from '../collections/is-record';
import { hostApi } from '../host/host-api';
import { getPlatform } from '../platform/get-platform';
import { UI_VIEWS_FILE } from './ui-views.constants';
import type { UiViewsSource, Views } from './ui-views.type';

const recordOf = (data: unknown): Views => (isRecord(data) ? data : {});

const parse = (text: string | null): Views => {
  try {
    return recordOf(text === null ? {} : JSON.parse(text));
  } catch {
    return {};
  }
};

const apiSource: UiViewsSource = {
  load: async () => {
    const api = hostApi();
    return recordOf(api ? await api.loadUiViews() : {});
  },
  save: async (all, changed) => {
    const api = hostApi();
    await (api?.patchUiViews ? api.patchUiViews(changed) : api?.saveUiViews(all));
  },
};

const fileSource = (): UiViewsSource => {
  let writing: Promise<void> = Promise.resolve();
  return {
    load: async () => parse(await getPlatform().files.readText(UI_VIEWS_FILE)),
    save: (all) => {
      const text = JSON.stringify(all, null, 2);
      writing = writing.catch(() => undefined).then(() => getPlatform().files.writeText(UI_VIEWS_FILE, text));
      return writing;
    },
  };
};

const uiViewsSource = (): UiViewsSource => (detectHost() === 'capacitor' ? fileSource() : apiSource);

export { uiViewsSource };
