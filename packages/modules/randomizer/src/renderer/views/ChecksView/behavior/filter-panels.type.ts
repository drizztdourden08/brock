/* @layer renderer-shell @kind types */
interface FilterPanels {
  filters: boolean;
  tags: boolean;
  toggleFilters(): void;
  toggleTags(): void;
}

export type { FilterPanels };
