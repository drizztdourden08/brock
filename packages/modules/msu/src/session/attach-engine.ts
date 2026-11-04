/* @layer core @kind logic */
import { msuSessionState } from '../msu-session';
import type { MsuSessionOptions } from '../msu-session';
import { publishSoundClaims } from '../msu-sound-claims';
import { createEngine } from './create-engine';
import { logAttached } from './log-attached';
import type { EngineHolder } from './session.type';

const attachEngine = <Ctx>(options: MsuSessionOptions<Ctx>, holder: EngineHolder<Ctx>): boolean => {
  const { host, config } = options;
  const target = host.audioTarget();
  if (!target) return false;
  const engine = createEngine(target.ctx, target.node, options);
  holder.engine = engine;
  msuSessionState.engine = engine;
  msuSessionState.teardown = { host, config };
  host.setExternalMusic(true);
  host.setVariant?.(options.variant ?? null);
  const claimed = publishSoundClaims(host, config, options.manifest, {
    ambient: options.replaceAmbient, sfx: options.replaceSfx,
  });
  host.announceCoreMusic?.();
  logAttached(options, claimed);
  return true;
};

export { attachEngine };
