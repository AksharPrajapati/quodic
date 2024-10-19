import React, { useEffect } from "react";
import useFetchHomeWorldData from "../utils/hooks/useFetchHomeWorldData";
import Spinner from "./Spinner";

interface ModalProps {
  character: any;
  closeModal: () => void;
}

const Modal: React.FC<ModalProps> = ({ character, closeModal }) => {
  const [data, loading]: any = useFetchHomeWorldData(character?.homeworld);

  const formattedDate = new Date(character.created).toLocaleDateString("en-GB");

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if ((event.target as HTMLElement).classList.contains("modal-overlay")) {
        closeModal();
      }
    };
    window.addEventListener("click", handleOutsideClick);
    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, [closeModal]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 modal-overlay">
      <div className="bg-white w-11/12 md:w-2/3 lg:w-1/2 p-6 rounded-lg shadow-lg relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          onClick={closeModal}
        >
          <svg
            className="h-8 w-8 text-gray-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />{" "}
            <line x1="9" y1="9" x2="15" y2="15" />{" "}
            <line x1="15" y1="9" x2="9" y2="15" />
          </svg>
        </button>

        <h2 className="text-2xl font-bold mb-4">{character.name}</h2>

        {loading ? (
          <div className="flex items-center justify-center h-8">
            <Spinner />
          </div>
        ) : (
          data && (
            <>
              <div className="space-y-2">
                <p>
                  <strong>Height:</strong> {character.height} cm
                </p>
                <p>
                  <strong>Mass:</strong> {character.mass} kg
                </p>
                <p>
                  <strong>Birth Year:</strong> {character.birth_year}
                </p>
                <p>
                  <strong>Date Added:</strong> {formattedDate}
                </p>
                <p>
                  <strong>Number of Films:</strong> {character.films.length}
                </p>
              </div>

              <div className="mt-4 space-y-2">
                <h3 className="text-xl font-semibold mt-4">
                  Homeworld Details:
                </h3>
                <p>
                  <strong>Name:</strong> {data.name}
                </p>
                <p>
                  <strong>Terrain:</strong> {data.terrain}
                </p>
                <p>
                  <strong>Climate:</strong> {data.climate}
                </p>
                <p>
                  <strong>Population:</strong> {data.population}
                </p>
              </div>
            </>
          )
        )}
      </div>
    </div>
  );
};

export default Modal;
