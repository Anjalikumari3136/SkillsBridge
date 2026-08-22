// client/src/components/Navbar.jsx
import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-inner">
        <NavLink to="/" className="navbar-brand" id="nav-brand">
        <div className="brand-icon" aria-hidden="true">🌉</div>
          <span>SkillsBridge</span>
        </NavLink>
        <ul className="navbar-nav" role="list">
          <li><NavLink to="/" id="nav-dashboard" end>Dashboard</NavLink></li>
          <li><NavLink to="/profile" id="nav-profile">Profile</NavLink></li>
          <li><NavLink to="/discover" id="nav-discover">Discover</NavLink></li>
          <li><NavLink to="/explorer" id="nav-explorer">Graph Explorer</NavLink></li>
        </ul>
      </div>
    </nav>
  );
}
