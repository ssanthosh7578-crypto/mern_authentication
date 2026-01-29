import {  createContext,useEffect,useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
export const AppContext = createContext();
export const ContextProvider   =(props)=>{
    axios.defaults.withCredentials = true;
    const _rawBackend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3005';
    const backendUrl = String(_rawBackend).replace(/\/$/, '');
    // If a token was stored (login returned it), attach Authorization header for requests
    const savedToken = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
    if (savedToken) {
        axios.defaults.headers.common = axios.defaults.headers.common || {};
        axios.defaults.headers.common.Authorization = `Bearer ${savedToken}`;
    }
    const [isLoggedIn,setIsLoggedIn]=useState(false);
    const [userData,setUserData]=useState(false);

    const getautheState = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/auth/is-auth`);
            if (data?.success) {
                setIsLoggedIn(true);
                await getuserdata();
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || error?.message || 'Failed to get auth state');
        }
    }

    const getuserdata = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/auth/data`);
            if (data?.success) setUserData(data.userData);
            else toast.error(data?.message || 'Failed to fetch user data');
        } catch (error) {
            toast.error(error?.response?.data?.message || error?.message || 'Failed to fetch user data');
        }
    }
    useEffect(()=>{
        getautheState()
    },[])
    const value={
        backendUrl,
        isLoggedIn,
        setIsLoggedIn,
        userData,
        setUserData,
        getuserdata
    }
return(
    <AppContext.Provider value={value}>
        {props.children}
    </AppContext.Provider>
)
}