/* @layer renderer-components @kind types */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { ResolvedControlsLabels } from '../ControlsSettings.type';

type Resolve = (value: Text) => string;
type PlainLabels = { [K in keyof ResolvedControlsLabels as ResolvedControlsLabels[K] extends string ? K : never]: string };
type NamedLabels = Omit<ResolvedControlsLabels, keyof PlainLabels>;

export type { NamedLabels, PlainLabels, Resolve };
