---
'@drizztdourden08/brock-react': minor
'@drizztdourden08/brock-build': minor
'@drizztdourden08/brock-lint-config': minor
'@drizztdourden08/create-brock': minor
---

A default widget layout and Reset layout. `src/widgets/layout.ts` default-exports `defineLayoutPreset({ rows, sizes, widths })`: rows of widget ids around the `main` view, with an array of ids tabbing them in one pane. `brock sync` exports it from `.brock/widgets.ts` as `appWidgetLayout` (undefined without the file), and `src/main.tsx` passes `widgetLayout={appWidgetLayout}` to `BrockApp`. A profile with no saved layout starts from it, and `meta.defaultOpen` opens a widget the preset does not place on its default side. `widgets.reset()` and the new Reset layout entry at the end of the Widgets menu put the layout back to that default. The `widget-layout-prop` migration wires `src/main.tsx`; the template ships a layout with Notes beside the main view.
