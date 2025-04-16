import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { MdLocalLibrary } from "react-icons/md";
import { getAuth, signOut } from "firebase/auth";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const auth = getAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("token");
      navigate("/"); // Redirect after logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navLinks = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "User Management", path: "/usermanagement" },
    { name: "Book Management", path: "/bookmanagement" },
    { name: "Assign Book", path: "/assignbook" },
    {name: "Borrowed Books", path: "/borrowedbooks"},
  ];

  return (
    <nav className="bg-gradient-to-br from-sky-600 to-blue-600 text-white shadow-lg fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/dashboard" className="text-2xl font-bold flex items-center gap-2">
          <MdLocalLibrary className="text-yellow-400" /> LibSys
        </Link>

        {/* Mobile menu button */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Nav links */}
        <ul
          className={`md:flex md:items-center gap-6 absolute md:static left-0 w-full md:w-auto bg-white/20 md:bg-transparent backdrop-blur-md md:backdrop-blur-none text-white rounded-b-lg transition-all ease-in-out duration-300 ${
            isOpen ? "top-16 opacity-100 visible" : "top-[-500px] opacity-0 invisible md:visible md:opacity-100"
          }`}
        >
          {navLinks.map(({ name, path }) => (
            <li key={path}>
              <Link
                to={path}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-2 md:py-0 rounded-md transition font-medium ${
                  location.pathname === path ? "text-yellow-400 font-bold" : "hover:text-yellow-300"
                }`}
              >
                {name}
              </Link>
            </li>
          ))}

          <li>
            <button
              onClick={handleLogout}
              className="block px-4 py-2 md:py-0 bg-red-500 hover:bg-red-600 text-white rounded-md transition"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
