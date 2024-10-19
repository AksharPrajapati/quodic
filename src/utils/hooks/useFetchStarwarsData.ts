import { useEffect, useState } from "react";

const useFetchStarwarsData = (searchTerm: string, page: number) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm, page]);

  useEffect(() => {
    const fetchStarwarsData = async () => {
      setLoading(true);
      try {
        const url = debouncedSearchTerm
          ? `https://swapi.dev/api/people/?search=${debouncedSearchTerm}&page=${page}`
          : `https://swapi.dev/api/people/?page=${page}`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        setData(result?.results || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStarwarsData(); // Always fetch data on change
  }, [debouncedSearchTerm, page]);

  return { data, loading };
};

export default useFetchStarwarsData;
