import { useEffect, useState } from "react";

const useFetchFilmsData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFilmsData();
  }, []);

  const fetchFilmsData = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://swapi.dev/api/films");
      const data = await response.json();
      setData(data?.results || []);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return { data, loading };
};

export default useFetchFilmsData;
