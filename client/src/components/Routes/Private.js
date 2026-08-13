import { useState,useEffect } from "react";
import { useAuth } from "../../context/auth";
import {Outlet} from 'react-router-dom'

//in react router dom version 6 it is used for routing
import axios from 'axios'
import Spinner from "../spinner";

export default function PrivateRoute(){
    const [ok,setOk]=useState(false);
    const [auth,setAuth]=useAuth();
    useEffect(()=>{
        const authCheck=async()=>{

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

            const res=await axios.get('/api/v1/auth/user-auth');
            if(res.data.ok){
                setOk(true);
            }
            else{
                setOk(false);
            }
        }
        if(auth?.token) authCheck()
    },[auth?.token]);
    return ok ? <Outlet/>: <Spinner/>
}