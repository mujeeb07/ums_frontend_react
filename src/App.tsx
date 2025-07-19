import AdminDashboard from "./pages/AdminDashboard";
import AuthForm from "./pages/AuthPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import './index.css'
import UserProfile from "./pages/UserProfile";
import AdminProfile from "./pages/AdminProfile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthForm /> }/>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
        <Route path="/users/Profile" element={<UserProfile/>}/>
      </Routes>
    </BrowserRouter>
  )
}
export default App;
