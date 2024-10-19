import { useQuery } from "@tanstack/react-query";

const useFetchHomeWorldData = (url: string) => {
  const fetchHomeWorldData = async () => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  return useQuery({
    queryKey: ["fetchHomeWorldData", url],
    queryFn: fetchHomeWorldData,
    retry: 3,
    retryDelay: 1 * 60 * 1000,
    refetchInterval: 3 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
  });
};

export default useFetchHomeWorldData;
