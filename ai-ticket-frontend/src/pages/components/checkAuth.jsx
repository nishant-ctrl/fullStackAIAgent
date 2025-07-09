import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../../store";
function CheckAuth({ children, protectedRoute }) {
    const navigate = useNavigate();
    const [loading,setLoading]=useState(true)
    const {userInfo,setUserInfo}=useAppStore()
    useEffect(()=>{
      if(protectedRoute){
        if (!userInfo) {
          console.log(userInfo)
          navigate("/login");
        } else {
            setLoading(false);
        }
      }else{
        if (userInfo) {
            navigate("/");
        } else {
            setLoading(false);
        }
      }
    },[navigate,protectedRoute,userInfo])
    if(loading) return <div>Loading...</div>
    return children
}

export default CheckAuth;
