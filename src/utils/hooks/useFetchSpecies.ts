import { useQuery } from "@tanstack/react-query";

const useFetchSpecies = () => {
  const fetchSpecies = async () => {
    try {
      const response = await fetch("https://swapi.dev/api/species/");
      const result = await response.json();
      return result.results;
    } catch (err) {
      console.log(err);
    }
  };

  return useQuery({
    queryKey: ["fetchSpecies"],
    queryFn: fetchSpecies,
    retry: 3,
    retryDelay: 1 * 60 * 1000,
    refetchInterval: 3 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
  });
};

export default useFetchSpecies;
