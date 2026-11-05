/* @layer renderer-shell @kind logic */
import type { CheatsTab } from '../CheatsShell.type';

const activeTabOf = (tabs: readonly CheatsTab[], stored: string, preferred: string | undefined): CheatsTab | undefined =>
  tabs.find((tab) => tab.id === stored) ?? tabs.find((tab) => tab.id === preferred) ?? tabs[0];

export { activeTabOf };
