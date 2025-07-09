import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
function CheckAuth({ children, protectedRoute }) {
    const navigate = useNavigate();
    const [loading,setLoading]=useState(true)
    useEffect(()=>{
      const user=localStorage.getItem("user")
      if(protectedRoute){
        if(!user){
          navigate("/login")
        }else{
          setLoading(false)
        }
      }else{
        if(user){
          navigate("/")
        }else{
          setLoading(false)
        }
      }
    },[navigate,protectedRoute])
    if(loading) return <div>Loading...</div>
    return children
}

export default CheckAuth;
