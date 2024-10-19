import { useState, useEffect } from "react";

const useFetchPlanets = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlanets = async () => {
      try {
        const response = await fetch("https://swapi.dev/api/planets/");
        const result = await response.json();
        setData(result.results);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlanets();
  }, []);

  return { data, loading };
};

export default useFetchPlanets;
