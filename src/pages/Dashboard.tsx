import React, { useState } from "react";
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

  const { data, loading } = useFetchStarwarsData(searchTerm);
  const { data: filmsData, loading: filmsLoading }: any = useFetchFilms();
  const { data: planetsData, loading: planetLoading }: any = useFetchPlanets();
  const { data: speciesData, loading: speciesLoading }: any = useFetchSpecies();

  const getBackgroundColor = (species: string) => {
    switch (species) {
      case "1":
        return "bg-blue-200";
      case "2":
        return "bg-yellow-200";
      case "3":
        return "bg-green-200";
      default:
        return "bg-gray-200";
    }
  };

  const openModal = async (character: any) => {
    setSelectedCharacter(character);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCharacter(null);
  };

  const filteredData = data?.filter((character: any) => {
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
    <>
      <div className="min-h-screen p-6 bg-gray-100">
        <Header />

        <div className="mb-6 flex flex-col sm:flex-row items-center">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-md p-2 mr-2 w-full sm:w-1/3"
          />
          <select
            value={filmFilter}
            onChange={(e) => setFilmFilter(e.target.value)}
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
            onChange={(e) => setSpeciesFilter(e.target.value)}
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
            onChange={(e) => setPlanetFilter(e.target.value)}
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

        {loading ? (
          <div className="w-full h-96 flex items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {(filteredData as any)?.map((character: any, index: number) => (
              <div
                key={character.id}
                onClick={() => openModal(character)}
                className={`${getBackgroundColor(
                  character.species.length.toString()
                )} p-4 rounded-lg shadow-md transform transition-transform duration-300 hover:scale-105 hover:shadow-lg`}
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
        )}
        {isModalOpen && (
          <Modal character={selectedCharacter} closeModal={closeModal} />
        )}
      </div>
    </>
  );
}

export default Dashboard;
