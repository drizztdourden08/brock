/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';
import type { MessageKey, TagMap, ValuesOf } from '@drizztdourden08/brock-core/i18n';

type TransProps<K extends MessageKey> = {
  readonly k: K;
  readonly values?: ValuesOf<K>;
  readonly tags: TagMap<ReactNode>;
};

export type { TransProps };
