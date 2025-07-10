import { Link, useNavigate } from "react-router-dom";
import { useAppStore } from "../../store";
import { apiClient } from "../../utils/api-client";
import { LOGOUT_USER } from "../../utils/constants";

export default function Navbar() {
    const { userInfo, setUserInfo } = useAppStore();
    const navigate=useNavigate()
    const handleLogout = async () => {
        try {
            const res = await apiClient.post(LOGOUT_USER,{},{withCredentials:true});
            if(res.status===200){
                setUserInfo(null)
                navigate("/login")
            }
        } catch (error) {
            console.log("Error logging out: ",error)
        }
    }
    return (
        <div className="shadow sticky z-50 top-0 navbar bg-base-200 px-4">
            <div className="flex-1">
                <Link to="/" className="text-xl font-bold text-primary">
                    TicketDesk
                </Link>
            </div>
            <div className="flex-none gap-4">
                <Link to="/" className="btn btn-ghost">
                    Home
                </Link>
                {userInfo?.role === "admin" && (
                    <Link to="admin" className="btn btn-ghost">
                        Admin Panel
                    </Link>
                )}
                {userInfo ? (
                    <div className="dropdown dropdown-end">
                        <label
                            tabIndex={0}
                            className="btn btn-ghost btn-circle avatar"
                        >
                            <div className="w-8 h-8 rounded-full bg-neutral text-white flex items-center justify-center">
                                {/* {userInfo.email?.[0]?.toUpperCase() || "U"} */}
                                👤
                            </div>
                        </label>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-40"
                        >
                            <li>
                                <span className="text-sm font-semibold">
                                    {userInfo?.email}
                                </span>
                            </li>
                            <li>
                                <button
                                    className="text-error"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </div>
                ) : (
                    <Link to="/login" className="btn btn-primary btn-sm">
                        Login
                    </Link>
                )}
            </div>
        </div>
    );
}
