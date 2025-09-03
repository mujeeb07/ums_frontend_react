import AdminDashboard from "./pages/AdminDashboard";
import AuthForm from "./pages/AuthPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import './index.css'
import UserProfile from "./pages/UserProfile";
import AdminProfile from "./pages/AdminProfile";
import ProtectedRoute from "./Components/ProtectedRoute";
import PublicRoute from "./Components/PublicRoute";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute/>}>
          <Route path="/" element={<AuthForm />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
          <Route path="/users/Profile" element={<UserProfile />} />
        </Route> 
      </Routes>
    </BrowserRouter>
  )
}
export default App;
