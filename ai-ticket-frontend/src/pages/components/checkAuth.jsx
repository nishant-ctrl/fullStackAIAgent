import React, { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAppStore } from "../../store";
// function CheckAuth({ children, protectedRoute }) {
//     const navigate = useNavigate();
//     const [loading,setLoading]=useState(true)
//     const {userInfo,setUserInfo}=useAppStore()
//     useEffect(()=>{
//       if(protectedRoute){
//         if (!userInfo) {
//           navigate("/login");
//         } else {
//           console.log(useAppStore.getState().userInfo)
//             setLoading(false);
//         }
//       }else{
//         if (userInfo) {
//             navigate("/");
//         } else {
//             setLoading(false);
//         }
//       }
//     },[navigate,protectedRoute,userInfo])
//     if(loading) return <div>Loading...</div>
//     return children
// }


export default CheckAuth;
