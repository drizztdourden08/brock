/* @layer renderer-shell @kind logic */
import type { ProductMenuEntry } from '@drizztdourden08/brock-core';
import type { ScreenMenu } from './screens-config.type';

const menuOverrideOf = (menu: ScreenMenu | undefined): ProductMenuEntry | null => (typeof menu === 'object' ? menu : null);

export { menuOverrideOf };
