/* @layer core @kind logic */
import type { OsKind } from '@drizztdourden08/brock-core';
import { USES_META } from './modifier.constants';

const primaryModifierLabel = (os?: OsKind): string => (os !== undefined && USES_META.has(os) ? 'Cmd' : 'Ctrl');

export { primaryModifierLabel };
