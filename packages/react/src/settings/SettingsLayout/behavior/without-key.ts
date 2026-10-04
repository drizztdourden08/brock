/* @layer renderer-shell @kind logic */
import type { BusyActions } from '../SettingsLayout.type';

const withoutKey = (busy: BusyActions, key: string): BusyActions =>
  (key in busy ? Object.fromEntries(Object.entries(busy).filter(([name]) => name !== key)) : busy);

export { withoutKey };
