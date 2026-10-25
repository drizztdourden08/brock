/* @layer renderer-shell @kind component */
import { Box } from '@drizztdourden08/tessera/primitives';
import { ANNOUNCER_CLASS } from '../announce.constants';
import { useAnnounceStore } from '../useAnnounceStore';
import './Announcer.css';

const Announcer = () => {
  const polite = useAnnounceStore((state) => state.polite);
  const assertive = useAnnounceStore((state) => state.assertive);
  return (
    <>
      <Box role="status" aria-live="polite" aria-atomic="true" className={ANNOUNCER_CLASS} data-announcer="polite">{polite}</Box>
      <Box role="alert" aria-live="assertive" aria-atomic="true" className={ANNOUNCER_CLASS} data-announcer="assertive">{assertive}</Box>
    </>
  );
};

export { Announcer };
