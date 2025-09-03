import { Navigate, Outlet } from "react-router-dom";


const protectedRoute = () => {
    const token = localStorage.getItem("accessToken");
    console.log("TOKEN:",token)
    if (!token) {
        return <Navigate to={"/"} replace/>
    }

    return <Outlet/>
}

export default protectedRoute