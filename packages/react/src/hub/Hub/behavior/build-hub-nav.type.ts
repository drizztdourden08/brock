/* @layer renderer-shell @kind types */
import type { TextOf } from '../../../i18n/i18n.type';
import type { HubGroup, HubPage } from '../../hub.type';

type HubNavInput = {
  readonly home: HubPage | undefined;
  readonly groups: readonly HubGroup[];
  readonly highlight?: (page: string) => void;
  readonly top?: readonly string[];
  readonly text?: TextOf;
};

export type { HubNavInput };
