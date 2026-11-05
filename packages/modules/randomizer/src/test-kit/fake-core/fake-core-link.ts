/* @layer core @kind logic */
import type { FakeCore } from './fake-core.type';
import type { FakeCoreLink } from './fake-core-link.type';
import type { FakeCoreHooks } from './fake-core-hooks.type';

const fakeCoreLink = (self: () => FakeCore, hooks: FakeCoreHooks): FakeCoreLink => {
  let listener: ((cause: string) => void) | null = null;
  return {
    killLink: () => {
      const core = self();
      if (core.down) return 'down';
      core.kills += 1;
      return 'armed';
    },
    onLinkDied: (f) => {
      listener = f;
      return () => { listener = null; };
    },
    die: (cause) => {
      const { byRoom, text } = hooks.deathOf(cause);
      if (!byRoom) listener?.(text);
    },
  };
};

export { fakeCoreLink };
