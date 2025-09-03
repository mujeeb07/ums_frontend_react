import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";


const publicRoute = () => {
    const token = localStorage.getItem("accessToken");
    const { user } = useSelector((state: any) => state.user);
    
    if (token) {
        const from = user?.role==="admin" ? "admin/profile" : "users/profile"

        console.log("pathname",from)
        return <Navigate to={from} replace/>
    }

    return <Outlet/>
}

export default publicRoute