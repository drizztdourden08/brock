<!-- @layer docs @kind doc -->
# An app IPC channel, end to end

An app channel is declared once. `defineChannels` in brock-core takes each channel's method name, its kind, its signature and its channel string, and gives back everything the three processes need: the maps the preload exposes on `window.api`, the contract types the augmentation adds, and entries that main's `handle`, `on` and `emit` and the renderer's `channelApi` take. The example below adds one invoke channel, `notes:add`, and one event channel, `notes:changed`. A send channel (renderer to main, no answer) works like the invoke one, with `send` in place of `invoke` and `on` in place of `handle`.

## 1. The declaration: `src/ipc/contract.constants.ts`

```ts
import { defineChannels, event, invoke } from '@drizztdourden08/brock-core';

const APP_CHANNELS = defineChannels({
  addNote: invoke<(text: string) => Promise<number>>()('notes:add'),
  onNotesChanged: event<(count: number) => void>()('notes:changed'),
});

const APP_INVOKE_MAP = APP_CHANNELS.maps.invoke;

const APP_SEND_MAP = APP_CHANNELS.maps.send;

const APP_EVENT_MAP = APP_CHANNELS.maps.events;

export { APP_CHANNELS, APP_INVOKE_MAP, APP_SEND_MAP, APP_EVENT_MAP };
```

Each object key becomes the method name on `window.api`; the string is the channel. An invoke signature returns a promise; send and event signatures return `void`. The builders are curried, `invoke<Signature>()('channel')`: TypeScript cannot infer the channel string as a literal type once the signature is written out, and the literal is what keys the contract. `maps.invoke`, `maps.send` and `maps.events` are the method-to-channel maps, so `electron/preload.ts`, as `create-brock` writes it, composes them with the base maps and needs no change.

## 2. The augmentation: `src/ipc/contract.type.ts`

```ts
import type { EventContract, InvokeContract, SendContract } from '@drizztdourden08/brock-core/augment';
import type { EventContractOf, InvokeContractOf, SendContractOf } from '@drizztdourden08/brock-core/ipc';
import type { APP_CHANNELS } from './contract.constants';

declare module '@drizztdourden08/brock-core/augment' {
  interface InvokeContract extends InvokeContractOf<typeof APP_CHANNELS> {}
  interface SendContract extends SendContractOf<typeof APP_CHANNELS> {}
  interface EventContract extends EventContractOf<typeof APP_CHANNELS> {}
}

export type { EventContract, InvokeContract, SendContract };
```

These three lines never change when a channel is added: `InvokeContractOf` turns the declaration into `{ 'notes:add': (text: string) => Promise<number> }`, and so on. Nothing imports this file, so knip lists `src/ipc/contract.type.ts` as an entry (the template's `knip.json` and `brock adopt` do).

## 3. The main handler: `electron/handlers/notes-handlers.ts`

```ts
import type { HandlerGroup } from '@drizztdourden08/brock-electron/main';
import { APP_CHANNELS } from '../../src/ipc/contract.constants';

const notesHandlers: HandlerGroup = {
  id: 'notes',
  register: ({ handle, emit }) => {
    const notes: string[] = [];
    handle(APP_CHANNELS.addNote, (_event, text) => {
      notes.push(text);
      emit(APP_CHANNELS.onNotesChanged, notes.length);
      return notes.length;
    });
  },
};

export { notesHandlers };
```

`handle`, `on` and `emit` take a declared entry or the channel string, typed against the augmentation either way, so a wrong argument fails `tsc`. `emit` sends to the app window. The file name is the convention: `brock sync` lists every `electron/handlers/<subject>-handlers.ts` (exporting `<subject>Handlers`) in `.brock/handlers.main.ts`, and `electron/main.ts` passes that list:

```ts
// electron/main.ts
import { mainHandlers } from '../.brock/handlers.main';

bootstrapApp(product, { modules: mainModules, bootTasks: mainBootTasks, handlers: mainHandlers });
```

A handler that needs the app's stores or services reads them from `ctx.services` (see [architecture.md](architecture.md), Main process).

## 4. The renderer call

`channelApi` from brock-react narrows `window.api` to Brock's methods plus the declared ones, typed by method name. It throws, naming the methods, when the preload does not expose them.

```tsx
import { useEffect, useState } from 'react';
import { channelApi } from '@drizztdourden08/brock-react';
import { Button } from '@drizztdourden08/tessera/primitives';
import { APP_CHANNELS } from '../ipc/contract.constants';

const NoteCount = () => {
  const [count, setCount] = useState(0);
  useEffect(() => channelApi(APP_CHANNELS).onNotesChanged(setCount), []);
  return <Button onClick={() => void channelApi(APP_CHANNELS).addNote('A note')}>Notes: {count}</Button>;
};
```

An invoke is a call that resolves with the handler's answer. An event method takes a callback and returns the unsubscribe call, which an effect returns as its cleanup. Brock's own channels sit on the same object, so `channelApi(APP_CHANNELS).getVersion()` works too.

## The three-place style

Channels written out by hand keep working, and both styles can sit in one app while it moves. There the signature goes in the augmentation, the method name in a map and the channel string in the handler:

```ts
// src/ipc/contract.type.ts
declare module '@drizztdourden08/brock-core/augment' {
  interface InvokeContract {
    'notes:add': (text: string) => Promise<number>;
  }
}

// src/ipc/contract.constants.ts
const APP_INVOKE_MAP = { addNote: 'notes:add' } as const satisfies Record<string, keyof InvokeContract>;

// electron/handlers/notes-handlers.ts
handle('notes:add', (_event, text) => notes.push(text));
```

The renderer then types `window.api` itself: `IpcApi<typeof BASE_INVOKE_MAP & typeof APP_INVOKE_MAP, ...>` from brock-core, narrowed from `requireHostApi()`. `brock migrate` from 0.16 lists, as one to-do, every channel in these maps that can move to `defineChannels`.
