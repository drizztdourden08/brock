/* @layer renderer-shell @kind hook */
import { useState } from 'react';

interface FilterPanels {
  filters: boolean;
  tags: boolean;
  toggleFilters(): void;
  toggleTags(): void;
}

const useFilterPanels = (): FilterPanels => {
  const [filters, setFilters] = useState(false);
  const [tags, setTags] = useState(false);
  return {
    filters,
    tags,
    toggleFilters: () => setFilters((open) => !open),
    toggleTags: () => setTags((open) => !open),
  };
};

export { useFilterPanels };
