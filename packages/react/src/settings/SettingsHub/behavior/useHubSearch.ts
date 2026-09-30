/* @layer renderer-shell @kind hook */
import { useCallback, useState } from 'react';

const useHubSearch = () => {
  const [query, setQuery] = useState('');
  const clear = useCallback(() => setQuery(''), []);
  return { query, setQuery, clear };
};

export { useHubSearch };
