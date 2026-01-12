import { NavLink } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
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
        </ul>

        <div className="navbar-actions">
          {/* We will add the User Profile/Login button here in Milestone 2 */}
          <button className="signin-btn">Sign In</button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;