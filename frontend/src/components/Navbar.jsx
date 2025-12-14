import React from "react";
import { Link, useLocation } from "react-router-dom";
import ThemeToggleButton from "./ThemeToggleButton";

export default function Navbar({ search, setSearch }) {
  const location = useLocation();
  const showSearch = location.pathname === "/";

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-title">
          AutoBlog
        </Link>
      </div>

      <div className="navbar-right">
        {showSearch && (
          <input
            type="text"
            className="navbar-search"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        )}

        <ThemeToggleButton />
      </div>
    </nav>
  );
}
