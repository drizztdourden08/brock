/* @layer renderer-shell @kind constants */
import type { ScreenMeta } from '@drizztdourden08/brock-react';
import { onlinePageShown } from '../renderer/bucket/online-page-shown';

const PAGE_METAS = {
  run: { title: 'Run', icon: 'play', showHeader: true, order: 1, keywords: ['seed', 'session', 'progress', 'summary', 'activity', 'players'] },
  options: { title: 'Options', icon: 'sliders-horizontal', showHeader: true, order: 2, fill: true, keywords: ['seed', 'settings', 'pool', 'logic'] },
  network: { title: 'Network', icon: 'server', showHeader: true, order: 3, when: onlinePageShown, keywords: ['archipelago', 'server', 'connection', 'health', 'players'] },
  online: { title: 'Online', icon: 'globe', showHeader: true, order: 4, when: onlinePageShown, keywords: ['archipelago', 'death link', 'track other players'] },
  logs: { title: 'Logs', icon: 'file-text', showHeader: true, order: 5, fill: true, keywords: ['log', 'activity', 'room', 'messages'] },
  spoiler: { title: 'Spoiler', icon: 'list', showHeader: true, order: 6, fill: true, keywords: ['placement', 'checks', 'locations', 'spheres'] },
} satisfies Record<string, ScreenMeta>;

export { PAGE_METAS };
