import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";
import { Outlet } from "react-router-dom";
import toast from "react-hot-toast";

//in react router dom version 6 it is used for routing
import axios from "axios";
import Spinner from "../spinner";

export default function PrivateRoute() {
  const [ok, setOk] = useState(false);
  const [auth, setAuth] = useAuth();
  useEffect(() => {
    const authCheck = async () => {
      try {
        // const res=await axios.get('/api/v1/auth/user-auth',
        // {
        //     headers:{
        //         "Authorization":auth?.token
        //     }//if we want not to provide this headers here we may simply add it in context
        //      //api-page globally then it will available to all components with the updated
        //      //token, so simply import axios in context folder and set default axios properties
        //      //before or after useEffect.
        // }
        // )

        const res = await axios.get("/api/v1/auth/user-auth");
        if (res.data.ok) {
          setOk(true);
        } else {
          setOk(false);
        }
      } catch (error) {
        console.log("Admin Auth Check Error:", error);
        setOk(false);

        if (error.code === "ERR_NETWORK") {
          toast.error("Server or Database is offline. Please try again later!");
        }
      }
    };
    if (auth?.token) authCheck();
  }, [auth?.token]);
  return ok ? <Outlet /> : <Spinner />;
}
