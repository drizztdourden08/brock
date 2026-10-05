---
'@drizztdourden08/brock-react': minor
'@drizztdourden08/brock-build': minor
---

A central context registry replaces the single widget context. `useContextsStore` holds named contexts, each `{ active, data? }`; the app and modules set them with `contexts.set('session', { active, data })` or `useSetAppContext('session', active, data?)` in a component, and read them with `useAppContext('session')`. A widget names the context it needs with `context: 'session'` in its definition or file `meta` (which makes it `context-only` by default) and shows only while that context is active, docked, floating and popped; module widgets register the same way as app widgets. The registry is relayed to popped widget windows, so `useAppContext` reads the same contexts there. `BrockApp`'s and `WidgetHost`'s `widgetContext` prop is deprecated but keeps working, driving the `default` context that context-only widgets with no context of their own follow; the `widget-context-registry` migration (0.22.0) lists each use as a to-do.
