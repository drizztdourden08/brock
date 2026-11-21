/* @layer renderer-shell @kind logic */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { SegmentOption } from '@drizztdourden08/tessera/primitives';
import type { ChecksOption } from '../ChecksView.type';

const segmentOptionsOf = <V extends string>(options: readonly ChecksOption<V>[], text: (value: Text) => string): SegmentOption<V>[] =>
  options.map(({ value, label, title }) => ({ value, label: text(label), ...(title === undefined ? {} : { title: text(title) }) }));

export { segmentOptionsOf };
