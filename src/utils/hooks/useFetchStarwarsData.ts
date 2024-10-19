import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

const useFetchStarwarsData = (searchTerm: string, page: number) => {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  const fetchStarwarsData = async () => {
    try {
      const url = debouncedSearchTerm
        ? `https://swapi.dev/api/people/?search=${debouncedSearchTerm}&page=${page}`
        : `https://swapi.dev/api/people/?page=${page}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data?.results || [];
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };

  return useQuery({
    queryKey: ["fetchStarwarsData", `${debouncedSearchTerm}-${page}`],
    queryFn: fetchStarwarsData,
    retry: 3,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000,
    refetchInterval: 3 * 60 * 1000,
    enabled: debouncedSearchTerm !== undefined || page >= 1,
  });
};

export default useFetchStarwarsData;
