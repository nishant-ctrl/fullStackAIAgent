import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx"
import Tickets from "./pages/tickets.jsx";
import TicketDetailsPage from "./pages/ticketDetailsPage.jsx";
import Login from "./pages/login.jsx";
import Signup from "./pages/signup.jsx";
import Admin from "./pages/admin.jsx";
import {
    BrowserRouter,
    Navigate,
    Route,
    Routes,
} from "react-router-dom";
import { useAppStore } from "./store/index.js";

const PrivateRoute = ({ children }) => {
    const { userInfo } = useAppStore();
    return !!userInfo ? children : <Navigate to="/login" replace />;
};
const AuthRoute = ({ children }) => {
    const { userInfo } = useAppStore();
    return !!userInfo ? <Navigate to="/" replace /> : children;
};

// const router = createBrowserRouter(createRoutesFromElements(
//     <>

//     </>
// ));

createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<App />}>
                <Route
                    path=""
                    element={
                        <PrivateRoute>
                            <Tickets />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="tickets/:id"
                    element={
                        <PrivateRoute>
                            <TicketDetailsPage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="login"
                    element={
                        <AuthRoute>
                            <Login />
                        </AuthRoute>
                    }
                />
                <Route
                    path="signup"
                    element={
                        <AuthRoute>
                            <Signup />
                        </AuthRoute>
                    }
                />
                <Route
                    path="admin"
                    element={
                        <PrivateRoute>
                            <Admin />
                        </PrivateRoute>
                    }
                />
            </Route>
        </Routes>
    </BrowserRouter>
);
