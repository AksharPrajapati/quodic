import React from "react";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  return (
    <div>
      <header className="mb-8">
        <nav className="flex justify-between items-center bg-white p-4 rounded-md shadow">
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
          </ul>
        </nav>
      </header>
    </div>
  );
}

export default Header;
