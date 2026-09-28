/* @layer renderer-app @kind constants */
import { homeScreen } from './screens/HomeScreen';
import { DEFAULT_SETTINGS, SETTINGS_TABS } from './settings.constants';

const SETTINGS = { defaults: DEFAULT_SETTINGS, tabs: SETTINGS_TABS };
const SCREENS = [homeScreen];

export { SCREENS, SETTINGS };
