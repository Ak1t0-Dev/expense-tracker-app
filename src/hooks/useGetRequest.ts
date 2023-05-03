import { useEffect, useState } from "react";
import { CATCHED_ERROR } from "../constants/message";

export const useGetRequest = <T>(url: string, errorMessage: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setData(data);
        } else {
          setError(errorMessage);
        }
      } catch {
        setError(CATCHED_ERROR);
      }

      setIsLoading(false);
    };

    fetchData();
  }, [url, errorMessage]);

  return { isLoading, data, error };
};
