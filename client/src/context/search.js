//it will work globally searching every where easily
// import it in index.js for global working.

import { useState, useContext, createContext } from "react";

const SearchContext = createContext();
const SearchProvider = ({ children }) => { //this {children} props will consider all the components
                                           //wraped or nested inside SearchProvider
  const [auth, setAuth] = useState({
    keyword: "",//req object
    results: [],//response object
  });

  return (
    <SearchContext.Provider value={[auth, setAuth]}>
      {children}
    </SearchContext.Provider>
  );
};

// custom hook
const useSearch = () => useContext(SearchContext);

export { useSearch, SearchProvider };
//useSearch means every component can use or modify search State wraped in SearchProvider