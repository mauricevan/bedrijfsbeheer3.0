// Generic API hooks for data fetching
import { useState, useEffect, useCallback } from 'react';

export interface UseAPIOptions<T> {
  fetchFn: () => Promise<T>;
  initialData?: T;
  autoFetch?: boolean;
}

export function useAPI<T>(options: UseAPIOptions<T>) {
  const { fetchFn, initialData, autoFetch = true } = options;

  const [data, setData] = useState<T | undefined>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchFn();
      setData(result);
      return result;
    } catch (err: any) {
      const errorMessage = err.error || err.message || 'Er is een fout opgetreden';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchFn]);

  useEffect(() => {
    if (autoFetch) {
      fetch();
    }
  }, [autoFetch, fetch]);

  const refetch = useCallback(() => {
    return fetch();
  }, [fetch]);

  return {
    data,
    setData, // Allow manual data updates
    isLoading,
    error,
    refetch,
  };
}

// Mutation hook for create/update/delete operations
export interface UseMutationOptions<TData, TVariables> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  onSuccess?: (data: TData) => void;
  onError?: (error: any) => void;
}

export function useMutation<TData, TVariables>(
  options: UseMutationOptions<TData, TVariables>
) {
  const { mutationFn, onSuccess, onError } = options;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(
    async (variables: TVariables) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await mutationFn(variables);
        onSuccess?.(result);
        return result;
      } catch (err: any) {
        const errorMessage = err.error || err.message || 'Er is een fout opgetreden';
        setError(errorMessage);
        onError?.(err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [mutationFn, onSuccess, onError]
  );

  return {
    mutate,
    isLoading,
    error,
  };
}
