/* @layer renderer-shell @kind hook */
import { useEffect } from 'react';
import type { SettingsStore } from '../stores/settings-store.type';
import { bindDeveloperTools } from './bind-developer-tools';
import type { DeveloperToolsSource } from './developer-tools.type';

const useDeveloperToolsSource = <S extends object>(source: DeveloperToolsSource | undefined, settings: SettingsStore<S>): void => {
  useEffect(() => {
    if (!source) return undefined;
    return bindDeveloperTools(typeof source === 'function' ? source(settings) : source);
  }, [source, settings]);
};

export { useDeveloperToolsSource };
