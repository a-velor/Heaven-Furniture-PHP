import { createContext, useContext, useEffect, useState } from "react";
const ThemeContext = createContext(void 0);
export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("heaven_theme");
      if (stored === "light" || stored === "dark") {
        return stored;
      }
    }
    return "dark";
  });
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    try {
      localStorage.setItem("heaven_theme", theme);
    } catch (e) {
      console.warn("Could not save theme preference to localStorage", e);
    }
  }, [theme]);
  const toggleTheme = () => {
    setThemeState((prev) => prev === "light" ? "dark" : "light");
  };
  const setTheme = (newTheme) => {
    setThemeState(newTheme);
  };
  return <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>;
};
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
