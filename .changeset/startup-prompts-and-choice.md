---
'@drizztdourden08/brock-react': minor
'@drizztdourden08/brock-build': minor
'@drizztdourden08/brock-lint-config': minor
---

Start-up prompts and a richer confirm dialog. A start-up prompt is `src/startup/<id>.prompt.ts`, default-exporting `defineStartupPrompt({ order?, run(ctx) })`; `RendererModule.startupPrompts` adds a module's. Brock runs them once per launch, one at a time in `order`, after the window reveal, once a profile is active with its settings loaded and after any first-run tour has ended or been skipped, and never on an automation launch. A prompt that throws is logged and the next one runs. `ctx` carries `confirmAction`, `confirmChoice`, `confirmSave`, `profile`, `settings` (`get`, `patch`, `flush`) and `nav`. `brock sync` writes `.brock/startup.ts` (a prompt with a literal `order` loads when it runs), `src/main.tsx` passes it as `startupPrompts` (the `startup-prompts` migration of 0.80.0 adds that), `brock structure` checks the folder and the lint preset lets prompt files default-export. `confirmChoice` takes `look: 'select'` (Tessera's `Select`, with `searchable`) in place of the radio group and still resolves the picked value, or `null` on cancel. Every confirm dialog takes `facts: { label, value }[]`, drawn under the message with Tessera's `FactsPanel`. Defaults are unchanged.
