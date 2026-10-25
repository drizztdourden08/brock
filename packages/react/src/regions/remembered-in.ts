/* @layer renderer-shell @kind logic */
import { lastFocused } from './last-focused';

const rememberedIn = (region: HTMLElement): HTMLElement | undefined => lastFocused.get(region);

export { rememberedIn };
