import React, { useState } from "react";
import Header from "../components/Header";
import useFetchStarwarsData from "../utils/hooks/useFetchStarwarsData";
import Modal from "../components/Modal";
import Spinner from "../components/Spinner";

function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<null>(null);

  const [data, loading] = useFetchStarwarsData();

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

  return (
    <>
      <div className="min-h-screen p-6 bg-gray-100">
        <Header />
        {loading ? (
          <div className="w-full h-96 flex items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {(data as any)?.map((character: any, index: number) => (
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
