import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import Header from "../components/Header";
import useFetchStarwarsData from "../utils/hooks/useFetchStarwarsData";
import Modal from "../components/Modal";
import Spinner from "../components/Spinner";
import useFetchFilms from "../utils/hooks/useFetchFilms";
import useFetchPlanets from "../utils/hooks/useFetchPlanets";
import useFetchSpecies from "../utils/hooks/useFetchSpecies";
import { useTheme } from "../utils/context/ThemeContext";

function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filmFilter, setFilmFilter] = useState("");
  const [speciesFilter, setSpeciesFilter] = useState("");
  const [planetFilter, setPlanetFilter] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const { isDarkMode } = useTheme();

  const { data: fetchedData, isLoading } = useFetchStarwarsData(
    searchTerm,
    page
  );
  const { data: filmsData } = useFetchFilms();
  const { data: planetsData } = useFetchPlanets();
  const { data: speciesData } = useFetchSpecies();

  const observer = useRef<IntersectionObserver | null>(null);

  // Reset data when search term or filters change
  useEffect(() => {
    setData([]);
    setPage(1);
    setHasMore(true);
  }, [searchTerm, filmFilter, speciesFilter, planetFilter]);

  // Fetch data effect
  useEffect(() => {
    if (fetchedData && fetchedData.length > 0) {
      setData((prevData) => [...prevData, ...fetchedData]);
      setHasMore(fetchedData.length > 0);
    } else {
      setHasMore(false);
    }
  }, [fetchedData]);

  // Debounce function to avoid multiple state updates for search input
  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const handleSearchChange = debounce(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    },
    500
  );

  const handleFilterChange = useCallback(
    (filterType: string, value: string) => {
      if (filterType === "film") setFilmFilter(value);
      if (filterType === "species") setSpeciesFilter(value);
      if (filterType === "planet") setPlanetFilter(value);
      setPage(1);
      setHasMore(true);
    },
    []
  );

  // Infinite scrolling logic
  const lastElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (isLoading || !hasMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  const openModal = useCallback((character: any) => {
    setSelectedCharacter(character);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedCharacter(null);
  }, []);

  // Memoized filtered data for performance optimization
  const filteredData = useMemo(() => {
    return data.filter((character: any) => {
      const matchesFilm = filmFilter
        ? character.films.includes(filmFilter)
        : true;
      const matchesSpecies = speciesFilter
        ? character.species.includes(speciesFilter)
        : true;
      const matchesPlanet = planetFilter
        ? character.planets === planetFilter
        : true;
      return matchesFilm && matchesSpecies && matchesPlanet;
    });
  }, [data, filmFilter, speciesFilter, planetFilter]);

  return (
    <div
      className={`min-h-screen p-6 ${
        isDarkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-black"
      }`}
    >
      <Header />

      <div className="mb-6 flex flex-col sm:flex-row items-center">
        <input
          type="text"
          placeholder="Search..."
          onChange={handleSearchChange}
          className={`border rounded-md p-2 mr-2 w-full sm:w-1/3 ${
            isDarkMode
              ? "border-gray-600 bg-gray-700 text-white"
              : "border-gray-300 bg-white text-black"
          }`}
        />
        <select
          value={filmFilter}
          onChange={(e) => handleFilterChange("film", e.target.value)}
          className={`border rounded-md p-2 mr-2 mb-4 sm:mb-0 min-w-48 ${
            isDarkMode
              ? "border-gray-600 bg-gray-700 text-white"
              : "border-gray-300 bg-white text-black"
          }`}
        >
          <option value="">All Films</option>
          {filmsData?.map((film: any) => (
            <option key={film.title} value={film.url}>
              {film.title}
            </option>
          ))}
        </select>
        <select
          value={speciesFilter}
          onChange={(e) => handleFilterChange("species", e.target.value)}
          className={`border rounded-md p-2 mr-2 mb-4 sm:mb-0 min-w-48 ${
            isDarkMode
              ? "border-gray-600 bg-gray-700 text-white"
              : "border-gray-300 bg-white text-black"
          }`}
        >
          <option value="">All Species</option>
          {speciesData?.map((species: any) => (
            <option key={species.name} value={species.url}>
              {species.name}
            </option>
          ))}
        </select>
        <select
          value={planetFilter}
          onChange={(e) => handleFilterChange("planet", e.target.value)}
          className={`border rounded-md p-2 mr-2 mb-4 sm:mb-0 min-w-48 ${
            isDarkMode
              ? "border-gray-600 bg-gray-700 text-white"
              : "border-gray-300 bg-white text-black"
          }`}
        >
          <option value="">All Planets</option>
          {planetsData?.map((planet: any) => (
            <option key={planet.name} value={planet.url}>
              {planet.name}
            </option>
          ))}
        </select>
      </div>

      {filteredData.length === 0 && !isLoading && (
        <div className="w-full text-center text-gray-600 mt-10">
          No results found
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredData.map((character: any, index: number) => (
          <div
            key={character.url}
            onClick={() => openModal(character)}
            className={`p-4 rounded-lg shadow-md transform transition-transform duration-300 hover:scale-105 hover:shadow-lg ${
              isDarkMode ? "bg-gray-700" : "bg-white"
            }`}
            ref={index === filteredData.length - 1 ? lastElementRef : null}
          >
            <img
              src={`https://picsum.photos/300/200?random=${index}`}
              alt={character.name}
              className="w-full h-40 object-cover rounded-t-lg"
              loading="lazy"
            />
            <div className="mt-4">
              <h2 className="text-xl font-semibold">{character.name}</h2>
              <p
                className={`mt-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {character.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {isLoading && (
        <div className="w-full h-20 flex items-center justify-center">
          <Spinner />
        </div>
      )}

      {isModalOpen && (
        <Modal character={selectedCharacter} closeModal={closeModal} />
      )}
    </div>
  );
}

export default Dashboard;
