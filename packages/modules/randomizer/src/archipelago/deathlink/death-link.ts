/* @layer core @kind logic */
import { DEATH_LINK_TAG } from '../handshake/handshake.constants';
import { KILL_LOG_NOTE, MS_PER_SECOND } from './death-link.constants';
import type { DeathLink, DeathLinkDeps } from './death-link.type';
import { createDeathLinkGuard } from './death-link-guard';
import { describeBounce } from './describe-bounce';

const createDeathLink = (deps: DeathLinkDeps): DeathLink => {
  const { send, slotName, host, log, notify, now = Date.now } = deps;
  const guard = createDeathLinkGuard(now);

  const unsubscribe = host.onLinkDied((cause) => {
    if (guard.killedRecently()) return;
    const source = slotName();
    const sentAt = guard.markSent();
    send({
      cmd: 'Bounce',
      tags: [DEATH_LINK_TAG],
      data: { time: sentAt / MS_PER_SECOND, source, cause: cause || `${source} died` },
    });
    log('[Online] DeathLink sent');
    notify({ kind: 'sent' });
  });

  return {
    handleBounced(packet) {
      if (!Array.isArray(packet.tags) || !packet.tags.includes(DEATH_LINK_TAG)) return;
      const { source, name, why } = describeBounce(packet.data);
      if (source === slotName() || guard.sentRecently()) return;
      guard.markKilled();
      const outcome = host.killLink();
      log(`[Online] DeathLink: ${why || `${name} died`}${KILL_LOG_NOTE[outcome]}`);
      if (outcome === 'unsupported') return;
      notify({ kind: outcome === 'armed' ? 'received' : 'dropped', source: name, cause: why });
    },
    dispose: unsubscribe,
  };
};

export { createDeathLink };
