import { useState, useEffect, useContext, createContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    token: "",
  });
  //___________

  //______________________See this in Project 3:14 to understand_____________
  //default axios
  axios.defaults.headers.common["Authorization"] = auth?.token;
  //now it will attach header by default with every request.which we have disable in the Private.js page
  //__________________________________________________________

  // useEffect is a function in which we can execute multipple functions
  useEffect(() => {
    const data = localStorage.getItem("auth");
    if (data) {
      const parseData = JSON.parse(data);
      setAuth({
        // ...auth,
          //here i have removed ...auth used in below old commented function, Because setAuth already replaces the whole auth object, so ...auth is unnecessary and can use an outdated state; directly setting user and token is cleaner.
        user: parseData.user,
        token: parseData.token,
      });
    }
    
  //eslint-disable-next-line
  }, []);
  // },[auth]); for this to understand see the project vedio at time 3:14 hours
  //_________________________________________________________________________________
  
  // Global Axios Interceptor (Network Errors & Auth Failures)
  useEffect(() => {
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response, // Successful response
      (error) => {
        // 1. Check for Network / Server Offline Error
        if (error.code === "ERR_NETWORK" || !error.response) {
          toast.error("Server or Database is Offline! Please try again later.");
        }
        // 2. Check for Token Expired / Unauthorized (401 Status)
        else if (error.response && error.response.status === 401) {
          toast.error("Session expired. Please login again.");
          localStorage.removeItem("auth");
          setAuth({ user: null, token: "" });
          window.location.href = "/login";
        }

        return Promise.reject(error);
      },
    );

    // Eject interceptor on cleanup
    return () => {
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);
  //_____________________________________________________________________

  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
    </AuthContext.Provider>
  );
};
//remember always we will create custome hooks with use word see below
const useAuth = () => useContext(AuthContext);
export { useAuth, AuthProvider };
//import it simply in index.js so it will work globally.
   //____________________________________________________________________
