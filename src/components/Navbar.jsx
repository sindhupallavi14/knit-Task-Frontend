import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";

export default function Navbar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleProfile = () => {
    navigate("/profile");
  }

  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Left: Task Heading */}
          <div
            className="flex-shrink-0 text-2xl font-bold cursor-pointer"
            onClick={() => navigate("/dashboard")}
          >
            Tasks
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm font-semibold"
            >
              Logout
            </button>
            <FaUserCircle onClick={handleProfile} className="text-3xl cursor-pointer" />
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-800 px-4 py-2 flex flex-col gap-2">
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm font-semibold w-full"
          >
            Logout
          </button>
          <div onClick={handleProfile} className="flex items-center gap-2 text-lg cursor-pointer">
            <FaUserCircle /> Profile
          </div>
        </div>
      )}
    </nav>
  );
}
