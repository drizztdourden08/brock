/* @layer renderer-shell @kind hook */
import { useCallback } from 'react';
import { useNavigation } from '@drizztdourden08/brock-react';
import { RANDOMIZER_BUCKET_ID } from '../../../bucket/randomizer-bucket.constants';

const useOpenPage = (): ((page: string) => void) => {
  const { open } = useNavigation();
  return useCallback((page: string) => { open(`${RANDOMIZER_BUCKET_ID}/${page}`); }, [open]);
};

export { useOpenPage };
