/* @layer tooling-scripts @kind logic */
const MAP = /const\s+([A-Z_]+)\s*=\s*\{([^}]*)\}\s*as\s+const\s+satisfies\s+Record<string,\s*keyof\s+(Invoke|Send|Event)Contract>/g;
const ENTRY = /([A-Za-z_$][\w$]*)\s*:\s*['"]([^'"]+)['"]/g;
const KIND = { Invoke: 'invoke', Send: 'send', Event: 'event' };

const lineOf = (source, index) => source.slice(0, index).split('\n').length;

const listOf = (channels) => channels.map(({ kind, method, channel }) => `${method} (${kind} '${channel}')`).join(', ');

const apply = ({ source }) => {
  if (source.includes('defineChannels(')) return { source, todos: [] };
  const maps = [...source.matchAll(MAP)];
  const channels = maps.flatMap((map) => [...map[2].matchAll(ENTRY)].map((entry) => ({ kind: KIND[map[3]], method: entry[1], channel: entry[2] })));
  if (channels.length === 0) return { source, todos: [] };
  return {
    source,
    todos: [{
      line: lineOf(source, maps[0].index),
      message: `${channels.length} channel(s) can move to one declaration: ${listOf(channels)}. Declare them in APP_CHANNELS = defineChannels({ name: invoke<signature>()('channel'), ... }) from @drizztdourden08/brock-core, keep APP_INVOKE_MAP = APP_CHANNELS.maps.invoke (and send, events) for the preload, and replace the signatures in src/ipc/contract.type.ts with interface InvokeContract extends InvokeContractOf<typeof APP_CHANNELS> {} (and the send and event ones). The current three-place style keeps working; docs/ipc.md shows both.`,
    }],
  };
};

const migration = Object.freeze({
  id: 'channel-declarations',
  summary: 'An IPC channel can be declared once with defineChannels, which gives the augmentation, the maps and the typed handles. The app\'s channel maps become one to-do that lists the channels that can move; nothing is rewritten.',
  files: /(^|\/)src\/ipc\/[^/]+\.ts$/,
  apply,
});

export { migration };
