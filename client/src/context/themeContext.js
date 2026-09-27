//we have used this context ThemeProvider to access it globally because we need in every page
//light and dark mode so manually we have to use redux which is third-party and have to download
//or use props in each page but the context is the most easy and accessable API and ir comes
//with react it-self.Import it in index.js file

import {
   useState, 
   createContext, 
   useContext,

   //this is only for dynamic permanent theme saving
   useEffect 
  } from "react";

  //for saving theme we need user_id 
  import { useAuth } from "./auth";

const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {

  //This is static theme state every time on refresh reset to default for this donot need any useEffect
  // const [theme, setTheme] = useState("light");
  //____________________________________________

  //Dynamic Theme saving to local storage permanently according to the user logged in to website and guest mode both are saving
  const [auth] = useAuth();
  //Get theme key according to logged-in user
  const getThemeKey = () => {
    if (auth?.user?._id) {
      return `theme_${auth.user._id}`;
    }
    return "theme_guest";
  };

  const [theme, setTheme] = useState(() => {
  const key = "theme_guest";
    return localStorage.getItem(key) || "light";
  });

  //Load correct theme whenever login/logout happens
  useEffect(() => {
    const key = getThemeKey();
    const savedTheme = localStorage.getItem(key) || "light";
    setTheme(savedTheme);
  }, [auth?.user?._id]);

  // Save current theme for current user
  useEffect(() => {
    const key = getThemeKey();
    localStorage.setItem(key, theme);
  }, [theme, auth?.user?._id]);
  // __________________________________

  return (
    <ThemeContext.Provider value={[theme, setTheme]}>
      {children}
    </ThemeContext.Provider>
  );
};

//custom hook
const useTheme = () => useContext(ThemeContext);

export { useTheme, ThemeProvider };