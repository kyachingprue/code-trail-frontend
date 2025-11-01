import { Link, NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { useState } from 'react';
import navIcon from '../assets/images/binary.png'

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const toggleMenu = () => setOpen(!open);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/");
  };
  return (
    <div className="fixed top-0 left-0 w-full z-50 backdrop-blur-md shadow-lg border-b border-purple-700" >
      <div className="w-full mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex-1">
          <Link to='/' className="flex items-center gap-2 text-white">
            <img className='w-12' src={navIcon} alt="navbar icons" />
            <h2 className='text-xl md:text-3xl'>CodeTrail</h2>
          </Link>
        </div>
        <div className="flex-none">
          {!user ? (
            // 🔹 Before login
            <ul className="menu menu-horizontal md:px-1">
              <li>
                <NavLink to="/" className="text-white hover:text-cyan-400">
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/login"
                  className="text-white hover:text-cyan-400 hover:underline"
                >
                  Login
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/register"
                  className="text-white hover:text-cyan-400 hover:underline"
                >
                  Register
                </NavLink>
              </li>
            </ul>
          ) : (
            // 🔹 After login
            <div className="relative">
              <img
                src={user.photoURL || "https://i.ibb.co/2FsfXqM/user.png"}
                alt="Profile"
                onClick={toggleMenu}
                className="w-10 md:w-14 h-10 md:h-14 rounded-full border-2 border-cyan-500 cursor-pointer hover:scale-105 object-cover transition-transform"
              />

              {/* Dropdown Card */}
              {open && (
                <div className="absolute right-0 mt-3 w-48 bg-gray-900 text-white rounded-2xl shadow-lg border border-cyan-700 p-3 animate-fadeIn">
                  <p className="text-center font-semibold text-cyan-400 mb-2">
                    {user.displayName || "User"}
                  </p>
                  <ul className="space-y-2">
                    <li>
                      <Link
                        to="/"
                        onClick={() => setOpen(false)}
                        className="block px-3 py-2 rounded-lg hover:bg-cyan-800"
                      >
                        🏠 Home
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/profile"
                        onClick={() => setOpen(false)}
                        className="block px-3 py-2 rounded-lg hover:bg-cyan-800"
                      >
                        👤 Profile
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-600"
                      >
                        🚪 Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;