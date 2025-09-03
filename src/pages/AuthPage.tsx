import { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import type { RegisterPayload, LoginPayload } from "../types/auth";
import { useNavigate } from "react-router-dom";
import { login, register } from "../features/auth/authThunk";
import { useAppDispatch } from "../hooks/hooks";
import { setUserAuth } from "../features/auth/authSlice";
import { Flip, ToastContainer, toast } from 'react-toastify';
import { useSelector } from "react-redux";



export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState<RegisterPayload>({
    username: "",
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);

  const user = useSelector((state: any) => state.user);
  console.log("USER DATA:", user)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateFormdData = () => {
    const minUsernameLength = 3;
    const maxUsernameLength = 20;
    const minPasswordLength = 6;
    const maxPasswordLength = 12;
    const validUsername = /^[0-9A-Za-z]{3,16}$/;
    const validEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    toast.dismiss();

    const trimmedEmail = formData.email.trim();
    const trimmedPassword = formData.password.trim();
    const trimmedUsername = formData.username.trim();

    if (!trimmedEmail) {
      toast.error("Email is required");
      return false;
    }

    if (!validEmail.test(trimmedEmail)) {
      toast.error("Please enter a valid email address")
      return false
    }

    if (!trimmedPassword) {
      toast.error("Password is required");
      return false;
    }

    if (!isLogin) {
      if (!trimmedUsername) {
        toast.error("Username is requried for registration");
        return false;
      }

      if (trimmedUsername.length < minUsernameLength || trimmedUsername.length > maxUsernameLength) {
        toast.error(`Username must be between ${minUsernameLength} and ${maxUsernameLength} characters long`);
        return false
      }

      if (!validUsername.test(trimmedUsername)) {
        toast.error("Username can only contain letters and numbers (3-16 characters)");
        return false;
      }

      if (trimmedPassword.length < minPasswordLength || trimmedPassword.length > maxPasswordLength) {
        toast.error(`Password must be between ${minPasswordLength} and ${maxPasswordLength} characters long`);
        return false;
      }
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateFormdData()) return;

    try {
      if (isLogin) {
        const loginData: LoginPayload = {
          email: formData.email.trim(),
          password: formData.password.trim()
        };
        
        const res = await dispatch(login(loginData)).unwrap() as any;
        
        setFormData({
          username: "",
          email: "",
          password: ""
        });

        toast.success("Logged In successfully");
        console.log("Access Token:", res.token);
            
        dispatch(setUserAuth(res.token));

        res.role === "admin" ? navigate('/admin/profile') : navigate("/users/profile");

      } else {

        const registerData: RegisterPayload = {
          username: formData.username.trim(),
          email: formData.email.trim(),
          password: formData.password.trim()
        };

        await dispatch(register(registerData)).unwrap()

        setFormData({
          username: "",
          email: "",
          password: ""
        });
        
        toast.success("Registered Successfully! Please login.", {
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

          setIsLogin(true)
      }
      
    } catch (error: any) {

      if (isLogin) {
        const errorMessage = error
        toast.error(errorMessage, {
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
        const errorMessage = error
        toast.error(errorMessage, {
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
          />}
          {/* {!isLogin && ( */}
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="px-4 py-2 rounded-md bg-[#2e2e3e] focus:outline-none"
            />
          {/* )} */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="px-4 py-2 rounded-md bg-[#2e2e3e] w-full focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </button>
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
