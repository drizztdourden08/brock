/* @layer renderer-shell @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'A small card anchored below an element, with a title line and any content, dismissed by Escape or an outside click.',
  propsHash: '0000000000000000',
  useWhen: ['A popover built from your own controls needs the shared card look and a title.'],
  avoidWhen: [
    { case: 'A menu of app commands.', use: 'DropdownMenu' },
    { case: 'A blocking question that needs an answer.', use: 'Dialog' },
  ],
  rules: [
    'Pass the ref of the element that opened it as anchorRef and close it in onDismiss.',
    'Set role to menu or dialog to match the content; the title also names it.',
    'Use className only for extra layout; the card look is built in.',
  ],
  a11y: ['It carries the given role and is named by its title; Escape or an outside click dismisses it.'],
  buildingBlock: true,
  example: `import { AnchoredCard } from '@drizztdourden08/brock-react';
import type { RefObject } from 'react';

const Mounted = ({ anchorRef, onClose }: { anchorRef: RefObject<HTMLElement | null>; onClose: () => void }) => (
  <AnchoredCard anchorRef={anchorRef} title="Amount" role="dialog" onDismiss={onClose}>
    Content
  </AnchoredCard>
);
`,
} satisfies ComponentUsage;

export { usage };
