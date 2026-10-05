// Centralized hook for async data fetching with loading/error/empty states
import { useState, useEffect, useCallback } from "react";

export function useAsync(asyncFn, deps = []) {
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: null,
  });

  const execute = useCallback(async () => {
    setState({ data: null, loading: true, error: null });
    try {
      const data = await asyncFn();
      setState({ data, loading: false, error: null });
    } catch (err) {
      setState({ data: null, loading: false, error: err.message || "Something went wrong" });
    }
  }, deps);

  useEffect(() => {
    execute();
  }, [execute]);

  return { ...state, refetch: execute };
}
