/* @layer renderer-shell @kind logic */
import type { ScreensConfig } from './screens-config.type';

const settingsBucketOf = (config: ScreensConfig): string => config.settings?.bucket ?? config.home;

export { settingsBucketOf };
