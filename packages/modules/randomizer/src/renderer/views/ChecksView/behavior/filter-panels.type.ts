/* @layer renderer-shell @kind type */
interface FilterPanels {
  filters: boolean;
  tags: boolean;
  toggleFilters(): void;
  toggleTags(): void;
}

export type { FilterPanels };
