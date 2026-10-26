---
'@drizztdourden08/brock-react': minor
---

A settings page can show a preview beside its rows. A `TabDef` (or the `meta` of a `.settings.ts` page) takes `preview: (settings) => ReactNode` and `previewPlacement: 'start' | 'end'` (default `'end'`). In a wide page the preview takes a second column; in a narrow one it stacks above the rows. `<BrockApp background={node}>` draws one node behind the widget host and the docked panels, above the window background, and lets pointer events through.
