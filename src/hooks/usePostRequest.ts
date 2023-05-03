import { useEffect, useState } from "react";
import { CATCHED_ERROR } from "../constants/message";

export const usePostRequest = <T, U>(
  url: string,
  errorMessage: string,
  reqData: U
) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    // if (isDeepEqual(prevReqData, reqData )) {
    const fetchData = async () => {
      try {
        const response = await fetch(url, {
          method: "POST",
          mode: "cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(reqData),
        });
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
    // }

    fetchData();
  }, [url, errorMessage, reqData]);

  return { isLoading, data, error };
};
