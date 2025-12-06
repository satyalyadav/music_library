import React, { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import AudioPlayer from "./AudioPlayer";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="app-container">
      {/* Top Header Bar */}
      <header className="header">
        <span className="header-value">music library</span>
        <div className="header-spacer" />
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          data-tooltip={`Switch to ${
            theme === "light" ? "dark" : "light"
          } mode`}
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>
      </header>

      {/* Navigation */}
      {user ? (
        <nav className="nav">
          <NavLink
            to="/songs"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            //songs
          </NavLink>
          <NavLink
            to="/albums"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            //albums
          </NavLink>
          <NavLink
            to="/artists"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            //artists
          </NavLink>
          <NavLink
            to="/genres"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            //genres
          </NavLink>
          <NavLink
            to="/playlists"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            //playlists
          </NavLink>
          <div className="nav-spacer" />
          <span className="nav-user">{user.username}</span>
          <button className="btn btn-small" onClick={handleLogout}>
            logout
          </button>
        </nav>
      ) : (
        <nav className="nav">
          <NavLink
            to="/login"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            //login
          </NavLink>
          <NavLink
            to="/register"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            //register
          </NavLink>
        </nav>
      )}

      {/* Main Content */}
      <main className="main-content">{children}</main>

      {/* Audio Player */}
      {user && <AudioPlayer />}
    </div>
  );
};

export default Layout;
