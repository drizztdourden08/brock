<!-- @layer docs @kind doc -->
# An app IPC channel, end to end

An app channel touches four files: the augmentation names the channel and its signature, the map gives it a method name on `window.api`, a main handler group answers it, and the renderer calls it through one typed accessor. The example below adds one invoke channel, `notes:add`, and one event channel, `notes:changed`. A send channel (renderer to main, no answer) works like the invoke one, with `SendContract`, `APP_SEND_MAP` and `on` in place of `handle`.

## 1. The augmentation: `src/ipc/contract.type.ts`

```ts
import type { EventContract, InvokeContract, SendContract } from '@drizztdourden08/brock-core/augment';

declare module '@drizztdourden08/brock-core/augment' {
  interface InvokeContract {
    'notes:add': (text: string) => Promise<number>;
  }
  interface EventContract {
    'notes:changed': (count: number) => void;
  }
}

export type { EventContract, InvokeContract, SendContract };
```

The channel name is the key. An invoke channel returns a promise; an event channel returns `void`.

## 2. The maps: `src/ipc/contract.constants.ts`

```ts
import type { EventContract, InvokeContract, SendContract } from './contract.type';

const APP_INVOKE_MAP = { addNote: 'notes:add' } as const satisfies Record<string, keyof InvokeContract>;

const APP_SEND_MAP = {} as const satisfies Record<string, keyof SendContract>;

const APP_EVENT_MAP = { onNotesChanged: 'notes:changed' } as const satisfies Record<string, keyof EventContract>;

export { APP_INVOKE_MAP, APP_SEND_MAP, APP_EVENT_MAP };
```

Each key becomes a method on `window.api`. `electron/preload.ts`, as `create-brock` writes it, already composes these maps with the base maps, so the preload needs no change.

## 3. The main handler: `electron/handlers/notes-handlers.ts`

```ts
import type { HandlerGroup } from '@drizztdourden08/brock-electron/main';

const notesHandlers: HandlerGroup = {
  id: 'notes',
  register: ({ handle, emit }) => {
    const notes: string[] = [];
    handle('notes:add', (_event, text) => {
      notes.push(text);
      emit('notes:changed', notes.length);
      return notes.length;
    });
  },
};

export { notesHandlers };
```

`handle`, `on` and `emit` are typed against the augmentation, so a wrong channel name or argument fails `tsc`. `emit` sends to the app window. List the group in `electron/handlers/index.ts` and pass it on:

```ts
// electron/handlers/index.ts
import type { HandlerGroup } from '@drizztdourden08/brock-electron/main';
import { notesHandlers } from './notes-handlers';

const handlers: HandlerGroup[] = [notesHandlers];

export { handlers };

// electron/main.ts
bootstrapApp(product, { modules: mainModules, bootTasks: mainBootTasks, handlers });
```

## 4. The renderer call: `src/ipc/app-api.type.ts`, `src/ipc/app-api.ts` and a component

The type file names the full `window.api`, Brock's maps plus the app's, and one accessor narrows brock-react's `requireHostApi()` to it, so every caller shares it:

```ts
// src/ipc/app-api.type.ts
import type { BASE_EVENT_MAP, BASE_INVOKE_MAP, BASE_SEND_MAP, IpcApi } from '@drizztdourden08/brock-core';
import type { APP_EVENT_MAP, APP_INVOKE_MAP, APP_SEND_MAP } from './contract.constants';

type AppApi = IpcApi<
  typeof BASE_INVOKE_MAP & typeof APP_INVOKE_MAP,
  typeof BASE_SEND_MAP & typeof APP_SEND_MAP,
  typeof BASE_EVENT_MAP & typeof APP_EVENT_MAP
>;

export type { AppApi };
```

```ts
// src/ipc/app-api.ts
import { requireHostApi } from '@drizztdourden08/brock-react';
import type { AppApi } from './app-api.type';

const appApi = (): AppApi => requireHostApi() as AppApi;

export { appApi };
```

An invoke is a call that resolves with the handler's answer. An event method takes a callback and returns the unsubscribe call, which an effect returns as its cleanup:

```tsx
import { useEffect, useState } from 'react';
import { Button } from '@drizztdourden08/tessera/primitives';
import { appApi } from '../ipc/app-api';

const NoteCount = () => {
  const [count, setCount] = useState(0);
  useEffect(() => appApi().onNotesChanged(setCount), []);
  return <Button onClick={() => void appApi().addNote('A note')}>Notes: {count}</Button>;
};
```

Brock's own channels sit on the same `window.api` beside the app's, so `appApi()` reaches both.
