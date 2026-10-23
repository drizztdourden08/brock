---
'@drizztdourden08/brock-core': minor
'@drizztdourden08/brock-electron': minor
'@drizztdourden08/brock-react': minor
---

Main can now ask a renderer window a question and await a typed reply. Declare the channel with `ask<(id: string) => Promise<Snapshot>>()('doc:snapshot')` in `defineChannels`, add `AskContractOf<typeof APP_CHANNELS>` to the new `AskContract` interface, register the handler in the renderer with `answer(channel, handler)` from brock-react, and call `await ctx.ask(win, channel, ...args)` in main. Each ask has a correlation id and a 10 second timeout (`ctx.askWithin` sets another). It rejects with a clear message on a timeout, when the window has no handler, when the window closes, and with the handler's own message when it throws. No polling. See the Main asks a renderer section of `docs/architecture.md`.
