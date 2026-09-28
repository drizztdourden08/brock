/* @layer renderer-shell @kind hook */
import { useEffect } from 'react';
import { escapeLayers } from '../../../escape/escape-layers';
import { STANDARD_ESCAPE_LAYERS } from '../BrockApp.constants';

const useStandardEscapeLayers = (): void => {
  useEffect(() => {
    const removers = STANDARD_ESCAPE_LAYERS.map((layer) => escapeLayers.add(layer));
    return () => { for (const remove of removers) remove(); };
  }, []);
};

export { useStandardEscapeLayers };
