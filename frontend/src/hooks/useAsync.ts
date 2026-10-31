'use client';
import { DependencyList, useCallback, useEffect, useState } from 'react';

// Small data-loading hook: { data, loading, error, reload }.
export function useAsync<T>(fn: () => Promise<T>, deps: DependencyList = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const run = useCallback(() => {
    setLoading(true);
    fn()
      .then((d) => { setData(d); setError(''); })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, deps);

  useEffect(() => { run(); }, [run]);
  return { data, loading, error, reload: run, setData };
}
