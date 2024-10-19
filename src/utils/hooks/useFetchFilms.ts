import { useQuery } from "@tanstack/react-query";

const useFetchFilmsData = () => {
  const fetchFilmsData = async () => {
    try {
      const response = await fetch("https://swapi.dev/api/films");
      const data = await response.json();

      return data?.results;
    } catch (error) {
      console.error(error);
    }
  };

  return useQuery({
    queryKey: ["fetchFilmsData"],
    queryFn: fetchFilmsData,
    retry: 3,
    retryDelay: 1 * 60 * 1000,
    refetchInterval: 3 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
  });
};

export default useFetchFilmsData;
