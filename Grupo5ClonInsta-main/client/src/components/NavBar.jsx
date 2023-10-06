import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <nav className="bg-blue-500 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="text-white text-2xl font-bold">
            Tu Empresa
          </Link>
        </div>
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/home" className="text-white hover:text-gray-200">
            Home
          </Link>
          <Link to="/search" className="text-white hover:text-gray-200">
            Search
          </Link>
          <Link to="/add-entry" className="text-white hover:text-gray-200">
            Add Entry
          </Link>
        </div>
        <div className="flex md:hidden">
          <button className="text-white hover:text-gray-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {/* Icono de menú para dispositivos móviles */}
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
