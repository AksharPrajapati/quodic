import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../utils/context/ThemeContext";

function Header() {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  return (
    <div>
      <header className="mb-8">
        <nav
          className={`flex justify-between items-center ${
            isDarkMode ? "bg-gray-900" : "bg-white"
          }  p-4 rounded-md shadow`}
        >
          <h1 className="text-2xl font-bold">Marvel Characters Dashboard</h1>
          <ul className="flex space-x-4">
            <li>
              <a href="/" className="hover:text-blue-500">
                Dashboard
              </a>
            </li>
            <li>
              <p className="hover:text-blue-500" onClick={handleLogout}>
                Logout
              </p>
            </li>
            <li>
              <button onClick={toggleTheme}>
                {isDarkMode ? (
                  <span role="img" aria-label="Light Mode">
                    🌞
                  </span>
                ) : (
                  <span role="img" aria-label="Dark Mode">
                    🌙
                  </span>
                )}
              </button>
            </li>
          </ul>
        </nav>
      </header>
    </div>
  );
}

export default Header;
