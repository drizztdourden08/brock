/* @layer renderer-shell @kind component */
import { Box } from '@drizztdourden08/tessera/primitives';
import type { HubBarePageProps } from './HubBarePage.type';
import './HubBarePage.css';

const HubBarePage = (props: HubBarePageProps) => {
  const { label, children } = props;
  return <Box as="section" className="hub-bare-page" aria-label={label}>{children}</Box>;
};

export { HubBarePage };
