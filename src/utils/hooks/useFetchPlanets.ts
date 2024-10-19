import { useQuery } from "@tanstack/react-query";

const useFetchPlanets = () => {
  const fetchPlanets = async () => {
    try {
      const response = await fetch("https://swapi.dev/api/planets/");
      const result = await response.json();
      return result.results;
    } catch (err) {
      console.log(err);
    }
  };

  return useQuery({
    queryKey: ["fetchPlanets"],
    queryFn: fetchPlanets,
    retry: 3,
    retryDelay: 1 * 60 * 1000,
    refetchInterval: 3 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
  });
};

export default useFetchPlanets;
