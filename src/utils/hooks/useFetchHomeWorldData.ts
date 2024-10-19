import { useEffect, useState } from "react";

const useFetchHomeWorldData = (url: string) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchHomeWorldData();
  }, [url]);

  const fetchHomeWorldData = async () => {
    try {
      setLoading(true);
      const response = await fetch(url);
      const data = await response.json();
      setData(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return [data, loading];
};

export default useFetchHomeWorldData;
