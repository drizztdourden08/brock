/* @layer renderer-components @kind logic */
import { nav } from '@drizztdourden08/brock-react';
import { PAD_PARAM } from '../../ControllerDiagnostics';
import { DIAGNOSTICS_ROUTE } from '../ControllerPage.constants';

const openDiagnostics = (deviceKey: string): void => nav.open(DIAGNOSTICS_ROUTE, { [PAD_PARAM]: deviceKey });

export { openDiagnostics };
