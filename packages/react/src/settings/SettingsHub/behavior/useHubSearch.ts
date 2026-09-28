/* @layer renderer-shell @kind hook */
import { useCallback, useState } from 'react';

const useHubSearch = () => {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const searching = focused || query.trim() !== '';
  const clear = useCallback(() => setQuery(''), []);
  return { query, setQuery, setFocused, searching, clear };
};

export { useHubSearch };
