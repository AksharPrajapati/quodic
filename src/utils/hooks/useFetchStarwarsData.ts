import { useEffect, useState } from "react";

const useFetchStarwarsData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStarwarsData();
  }, []);

  const fetchStarwarsData = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://swapi.dev/api/people");
      const data = await response.json();
      setData(data?.results);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return [data, loading];
};

export default useFetchStarwarsData;
