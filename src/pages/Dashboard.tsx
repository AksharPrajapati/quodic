import React, { useState, useEffect, useRef, useCallback } from "react";
import Header from "../components/Header";
import useFetchStarwarsData from "../utils/hooks/useFetchStarwarsData";
import Modal from "../components/Modal";
import Spinner from "../components/Spinner";
import useFetchFilms from "../utils/hooks/useFetchFilms";
import useFetchPlanets from "../utils/hooks/useFetchPlanets";
import useFetchSpecies from "../utils/hooks/useFetchSpecies";

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

  const { data: fetchedData, loading } = useFetchStarwarsData(searchTerm, page);
  const { data: filmsData } = useFetchFilms();
  const { data: planetsData } = useFetchPlanets();
  const { data: speciesData } = useFetchSpecies();

  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (page === 1) {
      setData([]);
    }

    if (fetchedData && fetchedData.length > 0) {
      setData((prevData) => [...prevData, ...fetchedData]);
      setHasMore(fetchedData.length > 0);
    } else {
      setHasMore(false);
    }
  }, [fetchedData]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1);
    setHasMore(true);
  };

  const handleFilterChange = (filterType: string, value: string) => {
    if (filterType === "film") setFilmFilter(value);
    if (filterType === "species") setSpeciesFilter(value);
    if (filterType === "planet") setPlanetFilter(value);
    setPage(1);
    setHasMore(true);
  };

  const lastElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (loading || !hasMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const openModal = (character: any) => {
    setSelectedCharacter(character);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCharacter(null);
  };

  const filteredData = data.filter((character: any) => {
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

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <Header />

      <div className="mb-6 flex flex-col sm:flex-row items-center">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="border border-gray-300 rounded-md p-2 mr-2 w-full sm:w-1/3"
        />
        <select
          value={filmFilter}
          onChange={(e) => handleFilterChange("film", e.target.value)}
          className="border border-gray-300 min-w-48 rounded-md p-2 mr-2 mb-4 sm:mb-0"
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
          className="border border-gray-300 min-w-48 rounded-md p-2 mr-2 mb-4 sm:mb-0"
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
          className="border border-gray-300 min-w-48 rounded-md p-2 mr-2 mb-4 sm:mb-0"
        >
          <option value="">All Planets</option>
          {planetsData?.map((planet: any) => (
            <option key={planet.name} value={planet.url}>
              {planet.name}
            </option>
          ))}
        </select>
      </div>

      {filteredData.length === 0 && !loading && (
        <div className="w-full text-center text-gray-600 mt-10">
          No results found
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredData.map((character: any, index: number) => (
          <div
            key={character.url}
            onClick={() => openModal(character)}
            className="p-4 rounded-lg shadow-md transform transition-transform duration-300 hover:scale-105 hover:shadow-lg"
            ref={index === filteredData.length - 1 ? lastElementRef : null}
          >
            <img
              src={`https://picsum.photos/300/200?random=${index}`}
              alt={character.name}
              className="w-full h-40 object-cover rounded-t-lg"
            />
            <div className="mt-4">
              <h2 className="text-xl font-semibold">{character.name}</h2>
              <p className="text-gray-700 mt-2">{character.description}</p>
            </div>
          </div>
        ))}
      </div>

      {loading && (
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
