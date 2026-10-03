/* @layer renderer-shell @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'The notes of one release in a bordered box with a titled bar, as plain text that keeps its line breaks and scrolls past a fixed height.',
  useWhen: [
    'The notes of the picked version in the update dialog, or in the details of UtilityScreen.',
    'A changelog excerpt beside a version picker.',
  ],
  avoidWhen: [
    { case: 'A short note that stays on the page, such as a pre-release warning.', use: 'Callout' },
    { case: 'Code, a log or a diagnostics report.', use: 'CodeBlock' },
  ],
  rules: [
    'Pass the notes as a string to keep their line breaks; pass elements only when they are already formatted.',
    'Leave title out to read Release notes; set it when the box holds something else, such as the notes of every version since yours.',
    'Draw it only when there are notes: an empty box says nothing.',
  ],
  a11y: [
    'The box is a section headed by its title, an h4, so a screen reader can jump to it.',
    'The notes are one paragraph, read with their line breaks.',
  ],
  tree: {
    path: ['layout', 'a ready-made app panel', 'release notes'],
    rule: 'The notes of one version in a box that scrolls.',
  },
  example: `import { ReleaseNotesPanel } from '@drizztdourden08/brock-react';

const NotesSample = () => <ReleaseNotesPanel>{'Added\\n- Profiles can be renamed in place.'}</ReleaseNotesPanel>;
`,
  propsHash: 'c3ee9305366e531b',
} satisfies ComponentUsage;

export { usage };
