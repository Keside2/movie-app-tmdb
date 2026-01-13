import { NavLink, useNavigate } from 'react-router-dom';
import { useWatchlist } from '../../context/WatchListContext'; // Import the hook
import './Navbar.css';
import { useAuth } from '../../context/AuthContext';

function Navbar() {
  const { watchlist } = useWatchlist(); // Get the watchlist data
  const { user, logout } = useAuth(); // Get user and logout from context
  const navigate = useNavigate();

  const handleLogout = async () => {
  try {
    await logout(); // Calls the firebase signOut from your AuthContext
    navigate('/login'); // Takes them straight to the Login page
  } catch (error) {
    console.error("Error signing out:", error);
  }
};

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <NavLink to="/" className="navbar-logo">
          MOVIE<span>APP</span>
        </NavLink>

        <ul className="nav-links">
          <li>
            <NavLink 
              to="/" 
              className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/search" 
              className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
            >
              Search
            </NavLink>
          </li>
          {/* ADDED WATCHLIST LINK */}
          <li>
            <NavLink 
              to="/watchlist" 
              className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
            >
              Watchlist 
              {watchlist.length > 0 && (
                <span className="watchlist-count">{watchlist.length}</span>
              )}
            </NavLink>
          </li>
        </ul>

        <div className="navbar-actions">
        {user ? (
          <div className="user-profile">
     
      <button className="signin-btn" onClick={handleLogout}>Logout</button>
    </div>
  ) : (
    <button className="signin-btn" onClick={() => navigate('/login')}>
      Sign In
    </button>
        )}
      </div>
      </div>

      
    </nav>
  );
}

export default Navbar;