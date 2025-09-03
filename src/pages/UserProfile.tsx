import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ChangeEvent } from 'react';
import { useAppDispatch } from "../hooks/hooks";
import { useSelector } from "react-redux";
import { getUserProfile } from "../features/users/userThunk";
import { uploadImageToCloudinary } from "../config/cloudinary";
import { udpateCurrentUser } from "../features/users/userThunk";
import { logout } from "../features/auth/authThunk";
import { setUserLogout } from "../features/auth/authSlice";
import { Profile } from "../Components/Profile";
import { toggleTheme } from "../features/users/userSlice";
import { ToastContainer, toast, Bounce } from 'react-toastify';

export default function UserProfile() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate()
    const { user, isLoading, error, isDarkTheme } = useSelector((state: any) => state.user);

    const [editMode, setEditMode] = useState(false);

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        dispatch(getUserProfile());
    }, []);

    useEffect(() => {
        if (user) {
            setUsername(user.username || "");
            setEmail(user.email || "");
            setImageUrl(user.image || "");
        }
    }, [user]);

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const result = await uploadImageToCloudinary(file);
            if (result) {
                setImageUrl(result);
            }
        } catch (err) {
            toast.error(`${error}!` || "Image upload failed", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                transition: Bounce,
                theme: "dark",
            });

        } finally {
            setUploading(false);
        }
    };

    const validateFormData = () => {
        if (!email.trim()) {
            toast.error("Email is required");
            return false;
        }
        if (!username.trim()) {
            toast.error("username is required");
            return false;
        }
        return true;
    }

    const handleSave = async() => {

        if (!validateFormData()) return;
        
        try {
            if (!user?._id) { 
                toast.error("User Not found", {
                    position: "top-right",
                    autoClose: 4000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    transition: Bounce,
                    theme: "dark",
                });
                return;
            } 
            await dispatch(udpateCurrentUser({
                userId: user._id,
                username,
                email,
                image: imageUrl,
                status: user.status,
            })).unwrap();

            setEditMode(false);
            toast.success("User data saved");
            navigate("/users/profile");

        } catch (error: any) {
            toast.error(error)
        }
    };

    const handleCancel = () => {
        setEditMode(false);
        setUsername(user?.username || "");
        setEmail(user?.email || "");
        setImageUrl(user?.image || "");
    };

    // Logout
    const handleLogout = () => {
        try {
            console.log("Logout handler.......")
            dispatch(logout());
            dispatch(setUserLogout())
            navigate("/")
        } catch (error) {
            toast.error("something went wrong while logout")
        }
    }

    //Theme
    const handleTheme = () => {
        dispatch(toggleTheme(!isDarkTheme))
    }

    return (
        <div className={isDarkTheme ? "min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0f0c29] to-[#302b63] text-white"
            : "min-h-screen flex items-center justify-center bg-gradient-to-b from-[#eae8ff] to-[#9087f8] text-white"
        }>
            <div className={isDarkTheme ? "bg-[#1e1e2f] p-8 rounded-2xl shadow-2xl w-[400px]" : 
                "bg-[#48487d] p-8 rounded-2xl shadow-2xl w-[400px]"
            }>
                <h2 className="text-2xl font-bold mb-6 text-center">User Profile</h2>

                {isLoading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p className="text-red-400">{error}</p>
                ) : (
                    <>
                        <Profile
                            imageUrl={imageUrl}
                            editMode={editMode}
                            username={username}
                            email={email}
                            uploading={uploading}
                            setEditMode={setEditMode}
                            handleLogout={handleLogout}
                            setUsername={setUsername}
                            setEmail={setEmail}
                            handleFileChange={handleFileChange}
                            handleSave={handleSave}
                            handleCancel={handleCancel}
                            handleTheme={handleTheme}
                        />
                    </>
                )}
            </div>
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                transition={Bounce}
            />
        </div>
    );
}


