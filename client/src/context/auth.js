import { useState, useEffect, useContext, createContext } from "react";
import axios from 'axios';

const AuthContext=createContext();

const AuthProvider=({children})=>{
    const [auth,setAuth]=useState({
        user:null,
        token:""
    });
    
    //default axios
    axios.defaults.headers.common["Authorization"] = auth?.token;
    //no it will attach header by default with every request.which we have disable in the
    //Private.js page

    // useEffect is a function in which we can execute multipple functions
    useEffect(()=>{
        const data=localStorage.getItem('auth');
        if(data){
            const parseData=JSON.parse(data);
            setAuth({
                ...auth,
                user:parseData.user,
                token:parseData.token,
            });
        }
        //eslint-disable-next-line
    },[]);
    // },[auth]); for this to understand see the project vedio at time 3:14 hours
    return(
        <AuthContext.Provider value={[auth,setAuth]}>
            {children}
        </AuthContext.Provider>
    );
}

//creating custome hook remember always we will create custome hooks with use word see below
const useAuth=()=>useContext(AuthContext);
export {useAuth,AuthProvider}
//import it simply in index.js so it will work globally.