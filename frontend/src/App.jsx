import React, { useState, useEffect, createContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import ArticleList from "./pages/ArticleList";
import ArticleDetail from "./pages/ArticleDetail";

export const ThemeContext = createContext();

export default function App() {
  const [theme, setTheme] = useState("light");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored) setTheme(stored);
  }, []);

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Router>
        <Navbar search={search} setSearch={setSearch} />

        <Routes>
          <Route
            path="/"
            element={<ArticleList search={search} />}
          />
          <Route path="/article/:id" element={<ArticleDetail />} />
        </Routes>
      </Router>
    </ThemeContext.Provider>
  );
}
