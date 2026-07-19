import { useState, useEffect } from "react";

export const useFetchData = (fetchFn, errorMessage = "Failed to load data") => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchFn();
        setData(result);
      } catch (err) {
        console.error(`${errorMessage}:`, err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [fetchFn, errorMessage]);

  return { data, loading, error };
};
