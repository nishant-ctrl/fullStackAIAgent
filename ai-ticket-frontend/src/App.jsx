import { useEffect, useState } from "react";

import { Outlet } from "react-router-dom";
import { useAppStore } from "./store";
import { apiClient } from "./utils/api-client";
import {GET_CURRENT_USER} from "./utils/constants"
function App() {
    const { userInfo, setUserInfo } = useAppStore();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getUserData = async () => {
            try {
                const response = await apiClient.get(GET_CURRENT_USER, {
                    withCredentials: true,
                });
                if (response.status === 200 && response?.data?.data)
                    setUserInfo(response?.data?.data);
            } catch (error) {
                console.log("Erroe wile fetching user data: ", error);
            } finally {
                setLoading(false);
            }
        };
        if (!userInfo) {
            getUserData();
        } else {
            setLoading(false);
        }
    }, [setUserInfo]);

    if (loading) return <div>Loading...</div>;
    return <Outlet />;
}

export default App;
