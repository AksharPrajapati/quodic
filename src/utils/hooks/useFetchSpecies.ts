import { useState, useEffect } from "react";

const useFetchSpecies = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpecies = async () => {
      try {
        const response = await fetch("https://swapi.dev/api/species/");
        const result = await response.json();
        setData(result.results);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSpecies();
  }, []);

  return { data, loading };
};

export default useFetchSpecies;
