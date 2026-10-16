/* @layer renderer-shell @kind constants */
import type { TuckedControls } from '../../../../shell/TitleBar/behavior/pin-state.type';

const MENU_LABEL = 'Menu';

const TITLE_BAR_CLASS = 'brock-app__title-bar';

const TUCKED_ITEMS: Readonly<Record<keyof TuckedControls, string>> = { pin: 'control:pin', fullscreen: 'control:fullscreen' };

const ITEM_AWAY_CLASS = 'window-title-bar__item--away';

const NOT_TUCKED = '';

export { ITEM_AWAY_CLASS, MENU_LABEL, NOT_TUCKED, TITLE_BAR_CLASS, TUCKED_ITEMS };
