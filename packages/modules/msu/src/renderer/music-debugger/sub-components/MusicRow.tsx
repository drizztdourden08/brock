/* @layer renderer-shell @kind component */
import type { ReactNode } from 'react';
import { Box } from '@drizztdourden08/tessera/primitives';
import './MusicRow.css';

const MusicRow = (props: { className: string; empty?: boolean; children: ReactNode }) => (
  <Box className={`music-row ${props.className}`} data-empty={props.empty === true ? 'yes' : undefined}>
    {props.children}
  </Box>
);

export { MusicRow };
