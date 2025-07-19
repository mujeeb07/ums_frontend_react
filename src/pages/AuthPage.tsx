import { useState } from "react";
import type { RegisterPayload, LoginPayload } from "../types/auth";
import { registerUser } from "../services/authServices";
import { useNavigate } from "react-router-dom";
import { login } from "../features/auth/authThunk";
import { useAppDispatch } from "../hooks/hooks";
import { setUserAuth } from "../features/auth/authSlice";
import { Flip, ToastContainer, toast } from 'react-toastify';



export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState<RegisterPayload>({
    username: "",
    email: "",
    password: ""
  });
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        if (isLogin) {
      const loginData: LoginPayload = {
        email: formData.email,
        password: formData.password
      };
      
      const res = await dispatch(login(loginData)).unwrap() as any
          
      console.log("Login success:", res);
      toast.success("Logged In successfully");
          
      res.role === "admin" ? navigate('/admin/profile') : navigate("/users/profile");
      dispatch(setUserAuth(res.payload.token))
      
        } else {
          setFormData({
            username: "",
            email: "",
            password: ""
          });
      const registerData: RegisterPayload = {
        username: formData.username,
        email: formData.email,
        password: formData.password
      };
          setFormData({
            username: "",
            email: "",
            password: ""
          });
      const res = await registerUser(registerData);
      console.log("Registration success:", res);
          // toast("Registered Successfully")    
          toast.success("Registered Successfully", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            transition: Flip,
            theme: "dark",
          })
      setIsLogin(true)
    }
    } catch (error: any) {
      console.log("LOGGINNN>>>:", isLogin);
      console.log("error........ :", error)
      if (isLogin) {
        toast.error("Please enter valid  Email and Password.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          transition: Flip,
          theme: "dark",
        });
      } else {
        toast.error("Please fill out all required fields: Username, Email, and Password.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          transition: Flip,
          theme: "dark",
        });
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0f0c29] to-[#302b63] text-white">
      <div className="bg-[#1e1e2f] p-8 rounded-2xl shadow-2xl w-[400px]">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isLogin ? "Log In" : "Create an account"}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="px-4 py-2 rounded-md bg-[#2e2e3e] focus:outline-none"
            // required
          />}
          {/* {!isLogin && ( */}
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="px-4 py-2 rounded-md bg-[#2e2e3e] focus:outline-none"
              // required
            />
          {/* )} */}
          <div className="relative">
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="px-4 py-2 rounded-md bg-[#2e2e3e] w-full focus:outline-none"
              // required
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 py-2 rounded-md font-semibold hover:bg-blue-700 transition"
          >
            {isLogin ? "Log In" : "Create account"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-4">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-400 ml-1 hover:underline"
          >
            {isLogin ? "Sign up" : "Log In"}
          </button>
        </p>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Flip}
      />
    </div>
  );
}
