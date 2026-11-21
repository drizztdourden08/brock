/* @layer renderer-shell @kind constants */
import { msg } from '@drizztdourden08/brock-core/i18n';
import type { ScreenMeta } from '@drizztdourden08/brock-react';
import { onlinePageShown } from '../renderer/bucket/online-page-shown';

const PAGE_METAS = {
  run: { title: msg('randomizer:page.run'), icon: 'play', showHeader: true, order: 1, keywords: ['seed', 'session', 'progress', 'summary', 'activity', 'players'] },
  options: { title: msg('randomizer:page.options'), icon: 'sliders-horizontal', showHeader: true, order: 2, fill: true, keywords: ['seed', 'settings', 'pool', 'logic'] },
  network: { title: msg('randomizer:page.network'), icon: 'server', showHeader: true, order: 3, when: onlinePageShown, keywords: ['archipelago', 'server', 'connection', 'health', 'players'] },
  online: { title: msg('randomizer:page.online'), icon: 'globe', showHeader: true, order: 4, when: onlinePageShown, keywords: ['archipelago', 'death link', 'track other players'] },
  logs: { title: msg('randomizer:page.logs'), icon: 'file-text', showHeader: true, order: 5, fill: true, keywords: ['log', 'activity', 'room', 'messages'] },
  spoiler: { title: msg('randomizer:page.spoiler'), icon: 'list', showHeader: true, order: 6, fill: true, keywords: ['placement', 'checks', 'locations', 'spheres'] },
} satisfies Record<string, ScreenMeta>;

export { PAGE_METAS };
