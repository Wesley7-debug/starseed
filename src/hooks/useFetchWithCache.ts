'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface UseFetchWithCacheOptions<T> {
  url: string;
  enabled?: boolean;
  staleTime?: number;
  transform?: (data: unknown) => T;
}

interface UseFetchWithCacheReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const cache = new Map<string, { data: unknown; timestamp: number }>();
const inflight = new Map<string, Promise<unknown>>();

export default function useFetchWithCache<T>({
  url,
  enabled = true,
  staleTime = 60_000,
  transform,
}: UseFetchWithCacheOptions<T>): UseFetchWithCacheReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    const cached = cache.get(url);
    if (cached && Date.now() - cached.timestamp < staleTime) {
      setData(transform ? transform(cached.data) : (cached.data as T));
      setLoading(false);
      return;
    }

    if (inflight.has(url)) {
      try {
        const result = await inflight.get(url)!;
        if (mountedRef.current) {
          setData(transform ? transform(result) : (result as T));
          setLoading(false);
        }
        return;
      } catch {
        if (mountedRef.current) {
          setError('Failed to fetch');
          setLoading(false);
        }
        return;
      }
    }

    setLoading(true);
    setError(null);

    const promise = fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then((result) => {
        cache.set(url, { data: result, timestamp: Date.now() });
        inflight.delete(url);
        if (mountedRef.current) {
          setData(transform ? transform(result) : (result as T));
          setLoading(false);
        }
        return result;
      })
      .catch((err) => {
        inflight.delete(url);
        if (mountedRef.current) {
          setError(err instanceof Error ? err.message : 'Unknown error');
          setLoading(false);
        }
        throw err;
      });

    inflight.set(url, promise);
    await promise;
  }, [url, enabled, staleTime, transform]);

  useEffect(() => {
    mountedRef.current = true;
    fetchData();
    return () => {
      mountedRef.current = false;
    };
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
