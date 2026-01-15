import { NavLink, useNavigate } from 'react-router-dom';
import { useWatchlist } from '../../context/WatchListContext';
import './Navbar.css';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react'; // Added useState

function Navbar() {
  const { watchlist } = useWatchlist();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false); // State for hamburger

  const handleLogout = async () => {
    try {
      await logout();
      setMenuOpen(false); // Close menu on logout
      navigate('/login');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <NavLink to="/" className="navbar-logo" onClick={closeMenu}>
          MOVIE<span>APP</span>
        </NavLink>

        {/* Hamburger Icon */}
        <div className={`hamburger ${menuOpen ? 'active' : ''}`} onClick={toggleMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>

        {/* Nav Links - Added dynamic class for menuOpen */}
        <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <li>
            <NavLink to="/" className="nav-item" onClick={closeMenu}>Home</NavLink>
          </li>
          <li>
            <NavLink to="/search" className="nav-item" onClick={closeMenu}>Search</NavLink>
          </li>
          <li>
            <NavLink to="/watchlist" className="nav-item" onClick={closeMenu}>
              Watchlist 
              {watchlist.length > 0 && <span className="watchlist-count">{watchlist.length}</span>}
            </NavLink>
          </li>
          <li>
            <NavLink to="/profile" className="nav-item profile-link" onClick={closeMenu}>
              <img 
                src={`https://ui-avatars.com/api/?name=${user?.email}&background=random&color=fff`} 
                className="nav-avatar" 
                alt="Profile"
              />
              <span className="mobile-only-text">Profile</span>
            </NavLink>
          </li>
          {user && (
            <li className="mobile-only-logout">
               <button className="signin-btn" onClick={handleLogout}>Logout</button>
            </li>
          )}
        </ul>

        <div className="navbar-actions desktop-only">
          {user ? (
            <button className="signin-btn" onClick={handleLogout}>Logout</button>
          ) : (
            <button className="signin-btn" onClick={() => navigate('/login')}>Sign In</button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;