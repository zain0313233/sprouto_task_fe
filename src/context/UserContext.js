"use client";
import { createContext,useContext,useState } from "react";
import { useEffect } from "react";

const UserContext=createContext();
export const useUser=()=>useContext(UserContext);
export const UserProvider=({ children })=>{
    const [user,setUser]=useState(null);
    const [token,setToken]=useState(null);
    const [loading,setLoading]=useState(true);

     useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    

    if (storedUser && storedToken) {

      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }

    setLoading(false);
  }, []);

    const login = async(userData,token)=>{
        setUser(userData);
    
        setToken(token);
        localStorage.setItem("user",JSON.stringify(userData));
      
        localStorage.setItem("token",token);
    }
    const logout = ()=>{
        setUser(null);
        setToken(null);
        localStorage.removeItem("user");
       
        localStorage.removeItem("token");
    }
    return(
        <UserContext.Provider value={{ user, token,login, logout }}>
            {children}
        </UserContext.Provider>
    )
}


