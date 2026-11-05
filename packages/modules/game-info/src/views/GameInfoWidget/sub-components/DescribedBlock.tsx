/* @layer renderer-shell @kind component */
import { DescribedRow } from './DescribedRow';
import type { DescribedBlockProps } from './DescribedBlock.type';

const DescribedBlock = ({ block }: DescribedBlockProps) => (
  <>
    {block.rows.map((row) => <DescribedRow key={row.label} row={row} />)}
  </>
);

export { DescribedBlock };
