//we have used this context ThemeProvider to access it globally because we need in every page
//light and dark mode so manually we have to use redux which is third-party and have to download
//or use props in each page but the context is the most easy and accessable API and ir comes
//with react it-self.Import it in index.js file

import { useState, createContext, useContext } from "react";

const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");

  return (
    <ThemeContext.Provider value={[theme, setTheme]}>
      {children}
    </ThemeContext.Provider>
  );
};

//custom hook
const useTheme = () => useContext(ThemeContext);

export { useTheme, ThemeProvider };